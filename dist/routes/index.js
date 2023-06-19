"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRoutes = void 0;
const db_1 = __importDefault(require("../db"));
const setRoutes = (app) => {
    app.post('/reserve', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { vacancy_number, vehicle_id } = req.body;
        const vacancy = yield db_1.default.vacancy.findFirst({
            where: {
                number: vacancy_number
            }
        });
        if (!vacancy)
            return;
        const exists = yield db_1.default.vacancyReservation.findFirst({
            where: {
                vacancy_id: vacancy.id
            }
        });
        if (exists)
            return;
        const vacancyReservation = yield db_1.default.vacancyReservation.create({
            data: {
                vacancy_id: vacancy.id,
                vehicle_id
            }
        });
        if (!vacancyReservation)
            return;
    }));
    app.post('/occupied', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { vacancy_number } = req.body;
        const vacancy = yield db_1.default.vacancy.findFirst({
            where: {
                number: vacancy_number
            }
        });
        if (!vacancy)
            return;
        const vacancyReservation = yield db_1.default.vacancyReservation.findFirst({
            where: {
                vacancy_id: vacancy.id
            }
        });
        if (!vacancyReservation)
            return;
        yield db_1.default.vacancy.update({
            where: {
                id: vacancy.id
            },
            data: {
                isOccupied: true
            }
        });
        yield db_1.default.vacancyHistory.create({
            data: {
                vacancy_id: vacancy.id,
                vehicle_id: vacancyReservation.vehicle_id,
            }
        });
        yield db_1.default.vacancyReservation.delete({
            where: {
                vacancy_id: vacancy.id
            }
        });
    }));
    app.post('/open/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { vacancy_number } = req.body;
        const vacancy = yield db_1.default.vacancy.findFirst({
            where: {
                number: vacancy_number
            }
        });
        console.log({ vacancy });
        if (!vacancy)
            return;
        const vacancyHistories = yield db_1.default.vacancyHistory.findMany({
            where: {
                vacancy_id: vacancy.id
            }
        });
        const vacancyHistory = vacancyHistories[vacancyHistories.length - 1];
        console.log({ vacancyHistory });
        if (!vacancyHistory || vacancyHistory.end_date)
            return;
        yield db_1.default.vacancy.update({
            where: {
                id: vacancy.id
            },
            data: {
                isOccupied: false
            }
        });
        yield db_1.default.vacancyHistory.update({
            where: {
                id: vacancyHistory.id
            },
            data: {
                end_date: new Date()
            }
        });
    }));
    app.get('/vacancies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json({ vacancies: yield db_1.default.vacancy.findMany() });
    }));
    app.get('/vacancies/stories/:vacancyId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const vacancyId = req.params.vacancyId;
        if (!vacancyId)
            return;
        const stories = yield db_1.default.vacancyHistory.findMany({
            where: {
                vacancy_id: vacancyId
            }
        });
        res.json({ stories });
    }));
    app.get('/search/number/:vacancyNumber', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const vacancyNumber = Number(req.params.vacancyNumber);
        if (!vacancyNumber)
            return;
        const vacancy = yield db_1.default.vacancy.findFirst({
            where: {
                number: vacancyNumber
            }
        });
        if (!vacancy)
            return;
        res.json({ coords: vacancy.coords });
    }));
    app.get('/search/vehicle/:vehicleId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const vehicleId = req.params.vehicleId;
        console.log({ vehicleId });
        if (!vehicleId)
            return res.status(400).json({});
        const history = yield db_1.default.vacancyHistory.findFirst({
            where: {
                vehicle_id: vehicleId,
            }
        });
        if (!history || history.end_date)
            return res.status(400).json({});
        const vacancy = yield db_1.default.vacancy.findFirst({
            where: {
                id: history.vacancy_id
            }
        });
        if (!vacancy)
            return res.status(400).json({});
        res.json({ coords: vacancy.coords });
    }));
};
exports.setRoutes = setRoutes;
