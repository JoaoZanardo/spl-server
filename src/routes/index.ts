import { Express, Request, Response } from "express";
import prisma from '../db';

type ReserveBody = {
  vehicle_id: string;
  vacancy_number: number;
}

export const setRoutes = (app: Express) => {
  app.post('/reserve', async (req: Request, res: Response) => {
    const { vacancy_number, vehicle_id } = req.body as ReserveBody;
    const vacancy = await prisma.vacancy.findFirst({
      where: {
        number: vacancy_number
      }
    });
    if (!vacancy) return;
    const exists = await prisma.vacancyReservation.findFirst({
      where: {
        vacancy_id: vacancy.id
      }
    });
    if (exists) return;
    const vacancyReservation = await prisma.vacancyReservation.create({
      data: {
        vacancy_id: vacancy.id,
        vehicle_id
      }
    });
    if (!vacancyReservation) return;
  });

  app.post('/occupied', async (req: Request, res: Response) => {
    const { vacancy_number } = req.body as { vacancy_number: number }
    const vacancy = await prisma.vacancy.findFirst({
      where: {
        number: vacancy_number
      }
    });
    if (!vacancy) return;
    const vacancyReservation = await prisma.vacancyReservation.findFirst({
      where: {
        vacancy_id: vacancy.id
      }
    });
    if (!vacancyReservation) return;
    await prisma.vacancy.update({
      where: {
        id: vacancy.id
      },
      data: {
        isOccupied: true
      }
    });
    await prisma.vacancyHistory.create({
      data: {
        vacancy_id: vacancy.id,
        vehicle_id: vacancyReservation.vehicle_id,
      }
    });

    await prisma.vacancyReservation.delete({
      where: {
        vacancy_id: vacancy.id
      }
    })
  });

  app.post('/open/', async (req: Request, res: Response) => {
    const { vacancy_number } = req.body as { vacancy_number: number }
    const vacancy = await prisma.vacancy.findFirst({
      where: {
        number: vacancy_number
      }
    });
    if (!vacancy) return;
    const vacancyHistories = await prisma.vacancyHistory.findMany({
      where: {
        vacancy_id: vacancy.id
      }
    });
    const vacancyHistory = vacancyHistories[vacancyHistories.length - 1];
    if (!vacancyHistory || vacancyHistory.end_date) return;
    await prisma.vacancy.update({
      where: {
        id: vacancy.id
      },
      data: {
        isOccupied: false
      }
    });
    await prisma.vacancyHistory.update({
      where: {
        id: vacancyHistory.id
      },
      data: {
        end_date: new Date()
      }
    })
  });

  app.get('/vacancies', async (req: Request, res: Response) => {
    res.json({ vacancies: await prisma.vacancy.findMany() });
  });

  app.get('/vacancies/stories/:vacancyId', async (req: Request, res: Response) => {
    const vacancyId = req.params.vacancyId;
    if (!vacancyId) return;
    const stories = await prisma.vacancyHistory.findMany({
      where: {
        vacancy_id: vacancyId
      }
    });
    res.json({ stories });
  });

  app.get('/search/number/:vacancyNumber', async (req: Request, res: Response) => {
    const vacancyNumber = Number(req.params.vacancyNumber);
    if (!vacancyNumber) return;
    const vacancy = await prisma.vacancy.findFirst({
      where: {
        number: vacancyNumber
      }
    });
    if (!vacancy) return;
    res.json({ coords: vacancy.coords });
  });

  app.get('/search/vehicle/:vehicleId', async (req: Request, res: Response) => {
    const vehicleId = req.params.vehicleId;
    if (!vehicleId) return res.status(400).json({});
    const history = await prisma.vacancyHistory.findFirst({
      where: {
        vehicle_id: vehicleId,
      }
    });
    if (!history || history.end_date) return res.status(400).json({});
    const vacancy = await prisma.vacancy.findFirst({
      where: {
        id: history.vacancy_id
      }
    });
    if (!vacancy) return res.status(400).json({});
    res.json({ coords: vacancy.coords });
  });
}