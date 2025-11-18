import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../prisma/client';
import {
  generatePowerPointReport,
  generatePDFReport,
  generateExcelReport,
  generateHTMLReport,
} from '../services/export.service';

export async function downloadExport(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const exportJob = await prisma.exportJob.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!exportJob) {
      return res.status(404).json({ message: 'Job de exportação não encontrado' });
    }

    if (exportJob.status !== 'completed' || !exportJob.downloadUrl) {
      return res.status(400).json({
        message: 'Relatório ainda não está pronto',
        status: exportJob.status,
        progress: exportJob.progress,
      });
    }

    const filters = exportJob.filters as any;
    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);
    endDate.setHours(23, 59, 59, 999);

    let buffer: Buffer | string;
    let contentType: string;
    let filename: string;

    switch (exportJob.format) {
      case 'pptx':
        buffer = await generatePowerPointReport({
          startDate,
          endDate,
          promoterIds: filters.promoterIds,
          storeIds: filters.storeIds,
          format: 'pptx',
        });
        contentType =
          'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        filename = `relatorio-${filters.startDate}-${filters.endDate}.pptx`;
        break;
      case 'pdf':
        buffer = await generatePDFReport({
          startDate,
          endDate,
          promoterIds: filters.promoterIds,
          storeIds: filters.storeIds,
          format: 'pdf',
        });
        contentType = 'application/pdf';
        filename = `relatorio-${filters.startDate}-${filters.endDate}.pdf`;
        break;
      case 'excel':
        buffer = await generateExcelReport({
          startDate,
          endDate,
          promoterIds: filters.promoterIds,
          storeIds: filters.storeIds,
          format: 'excel',
        });
        contentType =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        filename = `relatorio-${filters.startDate}-${filters.endDate}.xlsx`;
        break;
      case 'html':
        const html = await generateHTMLReport({
          startDate,
          endDate,
          promoterIds: filters.promoterIds,
          storeIds: filters.storeIds,
          format: 'html',
        });
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Disposition', `attachment; filename="relatorio-${filters.startDate}-${filters.endDate}.html"`);
        return res.send(html);
      default:
        return res.status(400).json({ message: 'Formato não suportado' });
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error) {
    console.error('Download export error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getExportStatus(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const exportJob = await prisma.exportJob.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!exportJob) {
      return res.status(404).json({ message: 'Job de exportação não encontrado' });
    }

    res.json({
      id: exportJob.id,
      status: exportJob.status,
      progress: exportJob.progress,
      downloadUrl: exportJob.downloadUrl,
      format: exportJob.format,
      createdAt: exportJob.createdAt,
      updatedAt: exportJob.updatedAt,
    });
  } catch (error) {
    console.error('Get export status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


