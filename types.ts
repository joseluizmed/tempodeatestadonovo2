export interface MedicalCertificate {
  id: string;
  displayId: number;
  startDate: Date;
  endDate: Date;
  days: number;
  originalStartDateString: string; // Made non-optional
  originalEndDateString: string | undefined; // Kept as string | undefined as one of these two will exist
  originalDaysString: string | undefined;    // Kept as string | undefined
  status?: CertificateStatus; 
}

export enum CertificateStatus {
  CONTINUOUS = "Contínuo",
  NON_CONTINUOUS = "Não Contínuo",
  OVERLAPPING = "Sobreposto", // Indicates it contributes to an overlap
  FIRST = "Primeiro Atestado"
}

export interface TimelineSegment {
  id: string;
  startDate: Date;
  endDate: Date;
  type: 'covered' | 'overlapping' | 'gap';
  durationDays: number;
  tooltip: string;
}

export interface DetailedTimelineSegment extends TimelineSegment {
  certificatesInvolved: string[]; // IDs of original certificates
}

export interface AnalysisResults {
  longestContinuousLeave: {
    startDate: Date | null;
    endDate: Date | null;
    totalDays: number;
  };
  totalCertificates: number;
  continuousSequenceCount: number; // Number of times certificates were directly continuous
  overlappingCertificatesCount: number; // Number of certificates that participate in an overlap
  gapCount: number; // Number of gaps found
  totalNonCoveredDaysInGaps: number;
  timelineSegments: DetailedTimelineSegment[];
  allDates: Date[]; // All unique start/end dates for timeline scale
}

export enum DateInputType {
  END_DATE = "endDate",
  DAYS_OFF = "daysOff",
}