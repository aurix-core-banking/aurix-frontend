import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import { Typography } from '@mui/material';
import { CheckCircleOutline, HourglassEmpty, CancelOutlined } from '@mui/icons-material';
import { format } from 'date-fns';



const DEFAULT_STATUS_ORDER = [
  'RECEBIDA', 'EM_PREENCHIMENTO', 'CNPJ_CONSULTADO', 'SOCIOS_VALIDADOS',
  'DOCUMENTOS_PENDENTES', 'DOCUMENTOS_ANALISADOS', 'EM_ANALISE_KYC',
  'KYC_APROVADO', 'KYC_REJEITADO', 'EM_ANALISE_MANUAL',
  'AML_APROVADO', 'COMPLIANCE_APROVADO', 'EM_ASSINATURA',
  'CONTRATO_ASSINADO', 'APROVADA', 'CONTA_CRIADA', 'REJEITADA',
];

const DEFAULT_STATUS_LABELS = {
  RECEBIDA: 'Recebida',
  EM_PREENCHIMENTO: 'Em Preenchimento',
  CNPJ_CONSULTADO: 'CNPJ Consultado',
  SOCIOS_VALIDADOS: 'Sócios Validados',
  DOCUMENTOS_PENDENTES: 'Documentos Pendentes',
  DOCUMENTOS_ANALISADOS: 'Documentos Analisados',
  EM_ANALISE_KYC: 'Em Análise KYC',
  KYC_APROVADO: 'KYC Aprovado',
  KYC_REJEITADO: 'KYC Rejeitado',
  EM_ANALISE_MANUAL: 'Em Análise Manual',
  AML_APROVADO: 'AML Aprovado',
  COMPLIANCE_APROVADO: 'Compliance Aprovado',
  EM_ASSINATURA: 'Em Assinatura',
  CONTRATO_ASSINADO: 'Contrato Assinado',
  APROVADA: 'Aprovada',
  CONTA_CRIADA: 'Conta Criada',
  REJEITADA: 'Rejeitada',
};

export const StatusTimeline = ({ historico = [], statusAtual, statusOrder: propStatusOrder, statusLabels: propStatusLabels }) => {
  const STATUS_ORDER = propStatusOrder || DEFAULT_STATUS_ORDER;
  const STATUS_LABELS = propStatusLabels || DEFAULT_STATUS_LABELS;
  const historicoAcoes = new Set(historico.map((h) => h.acao));

  return (
    <Timeline position="right">
      {STATUS_ORDER.map((status) => {
        const isCompleted = historicoAcoes.has(status);
        const isCurrent = status === statusAtual;
        const isRejected = status === 'REJEITADA';
        const isFuture = STATUS_ORDER.indexOf(status) > STATUS_ORDER.indexOf(statusAtual);

        let dotColor = 'grey';
        let icon = <HourglassEmpty fontSize="small" />;
        if (isRejected) {
          dotColor = 'error';
          icon = <CancelOutlined fontSize="small" />;
        } else if (isCurrent) {
          dotColor = 'primary';
          icon = <HourglassEmpty fontSize="small" />;
        } else if (isCompleted) {
          dotColor = 'success';
          icon = <CheckCircleOutline fontSize="small" />;
        }

        const historicoEntry = historico.find((h) => h.acao === status);
        const formattedDate = historicoEntry
          ? format(new Date(historicoEntry.dataAcao), 'dd/MM HH:mm')
          : '';

        return (
          <TimelineItem key={status}>
            <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.2 }}>
              {formattedDate}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color={dotColor}>{icon}</TimelineDot>
              {status !== STATUS_ORDER[STATUS_ORDER.length - 1] && (
                <TimelineConnector sx={{ bgcolor: isFuture ? 'grey.300' : 'primary.light' }} />
              )}
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="body2" fontWeight={isCurrent ? 'bold' : 'normal'}>
                {STATUS_LABELS[status] || status}
              </Typography>
              {historicoEntry?.usuarioAnalista && (
                <Typography variant="caption" color="text.secondary">
                  {historicoEntry.usuarioAnalista}
                </Typography>
              )}
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};
