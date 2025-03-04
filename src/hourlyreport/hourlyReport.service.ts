import { InjectRepository } from "@mikro-orm/nestjs";
import { BadRequestException, Injectable } from "@nestjs/common";
import { HourlyEntry } from "./entities/hourlyEntry.entity";
import { EntityManager, EntityRepository, wrap } from "@mikro-orm/postgresql";
import { BreakDown } from "./entities/breakDown.entity";
import { DashboardDto, GetColorsDto, GetShiftReportDto, HourlyReportDto, RecordBreakdownDto, ResultMap } from "./dto/hourlyReport.dto";
import { Machine } from "src/basic/entities/machine.entity";
import { RootCause } from "src/basic/entities/rootCause.entity";
import { Shift, ShiftEnum } from "src/basic/entities/shift.entity";
import { Department } from "src/basic/entities/department.entity";
import { BDType } from "src/basic/entities/bdtype.enity";
import { ProductionDataRO, ShiftReportRowRO } from "./ro/productionData.ro";
import { User, UserRole } from "src/users/entities/user.entity";
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class HourlyReportService {
    constructor(
        @InjectRepository(HourlyEntry)
        private readonly hourlyEntryRepository: EntityRepository<HourlyEntry>,

        @InjectRepository(BreakDown)
        private readonly breakDownRepository: EntityRepository<BreakDown>,

        @InjectRepository(Machine)
        private readonly machineRepository: EntityRepository<Machine>,

        @InjectRepository(RootCause)
        private readonly rootCauseRepository: EntityRepository<RootCause>,

        @InjectRepository(Shift)
        private readonly shiftRepository: EntityRepository<Shift>,

        private readonly em: EntityManager,
    ) { }
    async recordHourlyData(id: number, dto: HourlyReportDto) {
        const [machine, shift, user] = await Promise.all([
            this.machineRepository.findOneOrFail({ id: dto.machineId }),
            this.shiftRepository.findOneOrFail({ id: dto.shiftId }),
            this.em.findOneOrFail(User, { id })
        ])

        const newEntry = new HourlyEntry({
            operatorName: dto.operatorName,
            operatorPhoneNo: dto.operatorPhoneNo,
            shiftIncharge: dto.shiftIncharge,
            shiftInchargePhoneNo: dto.shiftInchargePhoneNo,
            shiftSuperVisor: dto.shiftSuperVisor,
            shiftSuperVisorPhoneNo: dto.shiftSuperVisorPhoneNo,
            date: dto.date,
            shift,
            machine,
            diaDetails: dto.diaDetails,
            actProdPerHr: dto.actProdPerHr,
            stdProdPerHr: dto.stdProdPerHr,
            stdProdMTPerHr: dto.stdProdMTPerHr,
            actProdMTPerHr: dto.actProdMTPerHr
        })

        const newBreakdowns = dto.breakdownDetails.map((bd) => {
            return new BreakDown({
                startTime: bd.startTime,
                endTime: bd.endTime,
                hourlyEntry: newEntry,
                departement: this.em.getReference(Department, bd.departmentId),
                type: this.em.getReference(BDType, bd.typeId),
                reason: bd.reason
            });
        })
        this.em.persist(newEntry);
        this.em.persist(newBreakdowns);
        await this.em.flush();
        return {
            formData: new ProductionDataRO(newEntry, user),
            message: `Production Data recorded for shift ${shift.shift} ${shift.interval}`,
            status: 200 as const
        }
    }

    async updateHourlyData(userId: number, id: number, dto: HourlyReportDto) {
        const [machine, shift, entry, user] = await Promise.all([
            this.machineRepository.findOneOrFail({ id: dto.machineId }),
            this.shiftRepository.findOneOrFail({ id: dto.shiftId }),
            this.hourlyEntryRepository.findOneOrFail({ id: id }, { populate: ['breakdowns'] }),
            this.em.findOneOrFail(User, { id: userId })
        ])
        if (entry.machine.id != dto.machineId) {
            throw new BadRequestException('Machine details can not be modified for a submitted data. Please refresh the page and try again.')
        }
        if (entry.shift.id != dto.shiftId) {
            throw new BadRequestException('Shift details can not be modified for a submitted data. Please refresh the page and try again.')
        }
        wrap(entry).assign({
            operatorName: dto.operatorName,
            operatorPhoneNo: dto.operatorPhoneNo,
            shiftIncharge: dto.shiftIncharge,
            shiftInchargePhoneNo: dto.shiftInchargePhoneNo,
            shiftSuperVisor: dto.shiftSuperVisor,
            shiftSuperVisorPhoneNo: dto.shiftSuperVisorPhoneNo,
            diaDetails: dto.diaDetails,
            actProdPerHr: dto.actProdPerHr,
            stdProdPerHr: dto.stdProdPerHr,
        });

        dto.breakdownDetails.filter((bd) => bd.id == 0).map((bd) => {
            const newbd = new BreakDown({
                startTime: bd.startTime,
                endTime: bd.endTime,
                hourlyEntry: entry,
                departement: this.em.getReference(Department, bd.departmentId),
                type: this.em.getReference(BDType, bd.typeId),
                reason: bd.reason
            });
            this.em.persist(newbd);
        });
        await this.em.flush();
        return {
            formData: new ProductionDataRO(entry, user),
            message: `Production Data updated for shift ${shift.shift} ${shift.interval}`,
            status: 200 as const
        }
    }

    async getProductionData(id: number, shiftId: number, date: string, machineId: number) {
        const [entry, shift, user, machine] = await Promise.all([
            this.hourlyEntryRepository.findOne(
                { machine: { id: machineId }, date, shift: { id: shiftId } },
                { populate: ['breakdowns', 'shift'] }
            ),
            this.shiftRepository.findOneOrFail(
                {
                    id: shiftId
                }
            ),
            this.em.findOneOrFail(User, { id }),
            this.em.findOneOrFail(Machine, { id: machineId })
        ]);
        if (entry)
            return new ProductionDataRO(entry, user);
        const basicDetails = await this.hourlyEntryRepository.findOne(
            {
                machine: machineId,
                shift: { shift: shift.shift },
                dateString: date,
            },
        );
        return ({
            id: null,
            operatorName: basicDetails?.operatorName || "",
            operatorPhoneNo: basicDetails?.operatorPhoneNo || "",
            shiftIncharge: basicDetails?.shiftIncharge || "",
            shiftInchargePhoneNo: basicDetails?.shiftInchargePhoneNo || "",
            shiftSuperVisor: basicDetails?.shiftSuperVisor || "",
            shiftSuperVisorPhoneNo: basicDetails?.shiftInchargePhoneNo || "",
            diaDetails:
                [{
                    "length": null,
                    "nos": null,
                    "diameter": null,
                    "thickness": null
                }],
            breakdownDetails: [],
            status: true,
            actProdPerHr: null,
            stdProdPerHr: machine.stdProdPerHr,
            runningMints: null,
            stdProdMTPerHr: basicDetails?.stdProdMTPerHr || "",
            actProdMTPerHr: null,
        })
    }

    async getShiftData(dto: GetShiftReportDto) {
        const entries = await this.hourlyEntryRepository.find({
            machine: dto.machineId,
            shift: { shift: dto.shift },
            date: new Date(dto.date)
        },
            {
                populate: ['shift', 'breakdowns'],
                orderBy: { shift: 'ASC' }
            }
        );
        if (entries.length) {
            const list = entries.map((entry) => new ShiftReportRowRO(entry));
            return ({
                message: 'Shift Report found.',
                list,
                status: 200 as const
            });
        }
        return ({
            message: 'No entries found.',
            list: [],
            status: 200 as const
        })
    }

    async recordBreakdownDetails(user: User, dto: RecordBreakdownDto) {

        const breakDown = await this.breakDownRepository.findOneOrFail({ id: dto.id });
        const tdc = dto.date && !isNaN(new Date(dto.date).getTime()) ? new Date(dto.date) : null;
        wrap(breakDown).assign({
            reason: dto.reason,
            tempSolution: dto.tempSolution,
            permanentSolution: dto.permanentSolution,
            actionPlan: dto.actionPlan,
            tdc,
            tdcString: dto.date,
            nameOfEquipment: dto.nameOfEquipment,
            purchaseIssue: dto.purchaseIssue,
            departement: this.em.getReference(Department, dto.departmentId),
            type: this.em.getReference(BDType, dto.typeId),
            isApproved: true,
            rootCause: !isNaN(dto.rootCauseId) ? this.em.getReference(RootCause, dto.rootCauseId) : null
        });
        await this.em.flush();
        return {
            message: `B.D ${dto.reason.slice(0, 15)}... resolved.`,
            status: 200 as const
        }
    }

    async getColors(user: User, dto: GetColorsDto) {
        const date = new Date(dto.date);
        const entries = await this.hourlyEntryRepository.find({
            machine: dto.machineId,
            date,
        }, {
            populate: ['breakdowns', 'shift']
        }
        );
        const departments = user.department.map(department => Number(department));
        const shiftStatusMap = new Map<number, number>();
        entries.forEach(entry => {
            const relevantBreakdowns = user.role === UserRole.maintenance
                ? entry.breakdowns?.getItems()?.filter(bd => departments.includes(bd.departement?.id)) || []
                : entry.breakdowns?.getItems() || [];
            if (relevantBreakdowns.length === 0) {
                shiftStatusMap.set(entry.shift.id, 0);
            } else if (relevantBreakdowns.every(bd => bd.isApproved === true)) {
                shiftStatusMap.set(entry.shift.id, 1);
            } else {
                shiftStatusMap.set(entry.shift.id, 2);
            }
        });
        return ({
            map: Object.fromEntries(shiftStatusMap),
            message: "Status Fetch Successfully.",
            status: 200 as const
        })
    }

    async getDashboard(dto: DashboardDto, res: Response) {
        const { startDate, endDate } = dto;

        const entries = await this.hourlyEntryRepository.find(
            {
                $and: [
                    { date: { $gte: startDate } },
                    { date: { $lte: endDate } }
                ]
            },
            {
                populate: ['shift', 'breakdowns', 'machine'],
                orderBy: { machine: { id: "ASC" } }
            }
        );

        const result: ResultMap = {};

        entries.forEach(entry => {
            const { machine, actProdMTPerHr, breakdowns, stdProdMTPerHr, actProdPerHr, stdProdPerHr, shift } = entry;
            const machineId = machine.id;
            const shiftKey: ShiftEnum = shift.shift;

            const bdDuration = breakdowns.reduce((total: number, bd: BreakDown) => {
                if (!bd.startTime || !bd.endTime) return total;

                const start = new Date(`2000/01/01 ${bd.startTime}`);
                const end = new Date(`2000/01/01 ${bd.endTime}`);

                if (isNaN(start.getTime()) || isNaN(end.getTime())) return total;

                return total + Math.round((end.getTime() - start.getTime()) / 60000);
            }, 0);

            const runningMints = 60 - Number(bdDuration);

            if (!result[machineId]) {
                result[machineId] = {
                    A: { runningMints: 0, stdProdMTPerHr: 0, actProdMTPerHr: 0, actProdPerHr: 0, stdProdPerHr: 0, targetRunningHrs: 0 },
                    B: { runningMints: 0, stdProdMTPerHr: 0, actProdMTPerHr: 0, actProdPerHr: 0, stdProdPerHr: 0, targetRunningHrs: 0 },
                    C: { runningMints: 0, stdProdMTPerHr: 0, actProdMTPerHr: 0, actProdPerHr: 0, stdProdPerHr: 0, targetRunningHrs: 0 },
                    subtotal: { runningMints: 0, stdProdMTPerHr: 0, actProdMTPerHr: 0, actProdPerHr: 0, stdProdPerHr: 0, targetRunningHrs: 0 },
                    machine: entry.machine.name
                };
            }

            result[machineId][shiftKey].runningMints += runningMints || 0;
            result[machineId][shiftKey].stdProdMTPerHr += stdProdMTPerHr || 0;
            result[machineId][shiftKey].actProdMTPerHr += actProdMTPerHr || 0;
            result[machineId][shiftKey].actProdPerHr += actProdPerHr || 0;
            result[machineId][shiftKey].stdProdPerHr += stdProdPerHr || 0;
            result[machineId][shiftKey].targetRunningHrs += 1;

            result[machineId].subtotal.runningMints += runningMints || 0;
            result[machineId].subtotal.stdProdMTPerHr += stdProdMTPerHr || 0;
            result[machineId].subtotal.actProdMTPerHr += actProdMTPerHr || 0;
            result[machineId].subtotal.actProdPerHr += actProdPerHr || 0;
            result[machineId].subtotal.stdProdPerHr += stdProdPerHr || 0;
            result[machineId].subtotal.targetRunningHrs += 1;
        });

        const flatArray = Object.entries(result).flatMap(([machineId, shifts]) =>
            ["A", "B", "C", "subtotal"].map(shiftKey => ({
                machineId,
                machine: shifts.machine,
                shift: shiftKey,
                avgWtPerPc: shifts[shiftKey].actProdPerHr ? ((shifts[shiftKey].actProdMTPerHr * 1000) / shifts[shiftKey].actProdPerHr).toFixed(2) : "0",
                targetRunningHr: (shifts[shiftKey].targetRunningHrs).toFixed(2) || "",
                actualRunningHr: (shifts[shiftKey].runningMints / 60).toFixed(2) || "",
                standardProduction: shifts[shiftKey].stdProdMTPerHr.toFixed(2) || "",
                actualProduction: shifts[shiftKey].actProdMTPerHr.toFixed(2) || "",
                lossMT: (shifts[shiftKey].stdProdMTPerHr - shifts[shiftKey].actProdMTPerHr).toFixed(2) || "",
                targetProductionNos: (shifts[shiftKey].stdProdPerHr * 18).toFixed(0) || "",
                actualProductionNos: (shifts[shiftKey].actProdPerHr * 18).toFixed(0) || "",
                targetPcsPerHr: (6000 / Number(((shifts[shiftKey].actProdMTPerHr * 1000) / shifts[shiftKey].actProdPerHr).toFixed(2))).toFixed(2),
                actualPcsPerHr: shifts[shiftKey].actProdPerHr.toFixed(2) || "",
                lossPcsPerHr: (shifts[shiftKey].stdProdPerHr - shifts[shiftKey].actProdPerHr).toFixed(2),
                efficiencyPercentage: ((shifts[shiftKey].actProdMTPerHr / shifts[shiftKey].stdProdMTPerHr) * 100).toFixed(2)
            }))
        );
        if (dto.downloadRequest === 'true') {
            return this.generateExcel(flatArray, res);
        }
        return res.status(200).json({
            data: flatArray,
            status: 200,
            messages: "Entry fetched successfully."
        });
    }

    async generateExcel(data: any[], res: Response) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Production Data');

        worksheet.columns = [
            { header: 'Machine Name', key: 'machine', width: 20 },
            { header: 'Shift', key: 'shift', width: 10 },
            { header: 'Target Running Hr', key: 'targetRunningHr', width: 20 },
            { header: 'Actual Running Hr', key: 'actualRunningHr', width: 20 },
            { header: 'Standard Production', key: 'standardProduction', width: 20 },
            { header: 'Actual Production', key: 'actualProduction', width: 20 },
            { header: 'Loss (MT)', key: 'lossMT', width: 10 },
            { header: 'Target Production Nos', key: 'targetProductionNos', width: 20 },
            { header: 'Actual Production Nos', key: 'actualProductionNos', width: 20 },
            { header: 'Target Pcs/Hr', key: 'targetPcsPerHr', width: 20 },
            { header: 'Actual Pcs/Hr', key: 'actualPcsPerHr', width: 20 },
            { header: 'Loss Pcs/Hr', key: 'lossPcsPerHr', width: 15 },
            { header: 'Efficiency (%)', key: 'efficiencyPercentage', width: 15 },
        ];

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '4472C4' }
            };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        const machineMap = new Map();

        data.forEach(row => {
            if (!machineMap.has(row.machine)) {
                machineMap.set(row.machine, {
                    A: null,
                    B: null,
                    C: null,
                    subtotal: null
                });
            }
        });

        data.forEach(row => {
            if (machineMap.has(row.machine) && ['A', 'B', 'C', 'subtotal'].includes(row.shift)) {
                machineMap.get(row.machine)[row.shift] = row;
            }
        });

        const sortedMachines = Array.from(machineMap.keys()).sort();
        let rowIndex = 2;

        sortedMachines.forEach(machineName => {
            const machineData = machineMap.get(machineName);
            const shiftOrder = ['A', 'B', 'C', 'subtotal'];

            const firstRowIndex = rowIndex;

            shiftOrder.forEach((shift, idx) => {
                const row = machineData[shift] || {
                    machine: machineName,
                    shift: shift,
                    targetRunningHr: '',
                    actualRunningHr: '',
                    standardProduction: '',
                    actualProduction: '',
                    lossMT: '',
                    targetProductionNos: '',
                    actualProductionNos: '',
                    targetPcsPerHr: '',
                    actualPcsPerHr: '',
                    lossPcsPerHr: '',
                    efficiencyPercentage: ''
                };

                const excelRow = worksheet.addRow({
                    machine: idx === 0 ? machineName : '',
                    shift: shift,
                    targetRunningHr: row.targetRunningHr,
                    actualRunningHr: row.actualRunningHr,
                    standardProduction: row.standardProduction,
                    actualProduction: row.actualProduction,
                    lossMT: row.lossMT,
                    targetProductionNos: row.targetProductionNos,
                    actualProductionNos: row.actualProductionNos,
                    targetPcsPerHr: row.targetPcsPerHr,
                    actualPcsPerHr: row.actualPcsPerHr,
                    lossPcsPerHr: row.lossPcsPerHr,
                    efficiencyPercentage: row.efficiencyPercentage
                });

                for (let i = 3; i <= 13; i++) {
                    if (excelRow.getCell(i).value) {
                        excelRow.getCell(i).numFmt = i === 13 ? '0.00%' : '0.00';
                    }
                }

                if (shift === 'subtotal') {
                    excelRow.eachCell((cell, colNumber) => {
                        cell.font = { bold: true };
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'E6E6E6' }
                        };
                    });
                }

                excelRow.eachCell({ includeEmpty: true }, (cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                });

                rowIndex++;
            });

            if (shiftOrder.length > 0) {
                worksheet.mergeCells(`A${firstRowIndex}:A${firstRowIndex + shiftOrder.length - 1}`);
                worksheet.getCell(`A${firstRowIndex}`).alignment = {
                    vertical: 'middle',
                    horizontal: 'center'
                };
            }

            // if (sortedMachines.indexOf(machineName) < sortedMachines.length - 1) {
            //     const blankRow = worksheet.addRow([]);
            //     blankRow.height = 6;
            //     rowIndex++;
            // }
        });

        worksheet.addConditionalFormatting({
            ref: `M2:M${rowIndex - 1}`,
            rules: [
                {
                    type: 'colorScale',
                    priority: 1,
                    cfvo: [
                        { type: 'num', value: 0 },
                        { type: 'num', value: 50 },
                        { type: 'num', value: 100 }
                    ],
                    color: [
                        { argb: 'F8696B' },
                        { argb: 'FFEB84' },
                        { argb: '63BE7B' }
                    ]
                }
            ]
        });

        worksheet.properties.defaultRowHeight = 20;

        worksheet.views = [
            { state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A2' }
        ];

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=production_report_${new Date().getTime()}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    }
}