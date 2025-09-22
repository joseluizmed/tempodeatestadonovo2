
import { MedicalCertificate, AnalysisResults, CertificateStatus, DetailedTimelineSegment } from './types';
import { addDays, differenceInDays, formatDate } from './utils/dateUtils';

const analyzeCertificates = (certsInput: MedicalCertificate[]): {
    results: AnalysisResults,
    processedCerts: MedicalCertificate[]
  } => {
    const initialEmptyResults: AnalysisResults = {
      longestContinuousLeave: { startDate: null, endDate: null, totalDays: 0 },
      totalCertificates: 0,
      continuousSequenceCount: 0,
      overlappingCertificatesCount: 0,
      gapCount: 0,
      totalNonCoveredDaysInGaps: 0,
      timelineSegments: [],
      allDates: []
    };

    const validCerts = certsInput.filter(c => 
      c.startDate instanceof Date && !isNaN(c.startDate.getTime()) &&
      c.endDate instanceof Date && !isNaN(c.endDate.getTime()) &&
      c.startDate.getTime() <= c.endDate.getTime()
    );

    if (validCerts.length === 0) {
      return {
        results: initialEmptyResults,
        processedCerts: []
      };
    }

    const sortedCerts = [...validCerts].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    
    const certsWithDisplayIdAndStatus = sortedCerts.map((cert, index, arr) => {
        let status: CertificateStatus = CertificateStatus.FIRST;
        if (index > 0) {
            const prevCert = arr[index-1]; 
            if (addDays(prevCert.endDate, 1).getTime() === cert.startDate.getTime()) {
                status = CertificateStatus.CONTINUOUS;
            } else if (cert.startDate <= prevCert.endDate) { 
                status = CertificateStatus.OVERLAPPING; 
            } else { 
                status = CertificateStatus.NON_CONTINUOUS;
            }
        }
        return { ...cert, displayId: index + 1, status };
    });
    
    const events: { date: Date; type: 'start' | 'end'; certId: string }[] = [];
    certsWithDisplayIdAndStatus.forEach(cert => {
      events.push({ date: cert.startDate, type: 'start', certId: cert.id });
      events.push({ date: addDays(cert.endDate, 1), type: 'end', certId: cert.id });
    });

    events.sort((a, b) => a.date.getTime() - b.date.getTime());

    const timelineSegments: DetailedTimelineSegment[] = [];
    let activeCertIds = new Set<string>();
    
    for (let i = 0; i < events.length; i++) {
        const eventDate = events[i].date;
        const nextEventDate = (i + 1 < events.length) ? events[i+1].date : null;

        let j = i;
        while(j < events.length && events[j].date.getTime() === eventDate.getTime()) {
            const currentEvent = events[j];
            if (currentEvent.type === 'start') {
                activeCertIds.add(currentEvent.certId);
            } else {
                activeCertIds.delete(currentEvent.certId);
            }
            j++;
        }
        
        if (nextEventDate && eventDate.getTime() < nextEventDate.getTime()) {
            const intervalStart = eventDate;
            const intervalEnd = addDays(nextEventDate, -1);
            const duration = differenceInDays(intervalStart, intervalEnd) + 1;
            
            if (duration > 0) {
                const coverageCount = activeCertIds.size;
                let type: 'covered' | 'overlapping' | 'gap';
                let typeTooltip: string;
                
                if (coverageCount === 0) { type = 'gap'; typeTooltip = 'Não Coberto'; }
                else if (coverageCount === 1) { type = 'covered'; typeTooltip = 'Coberto'; }
                else { type = 'overlapping'; typeTooltip = 'Sobreposto'; }

                timelineSegments.push({
                    id: `seg-${intervalStart.getTime()}`,
                    startDate: intervalStart,
                    endDate: intervalEnd,
                    type: type,
                    durationDays: duration,
                    certificatesInvolved: Array.from(activeCertIds),
                    tooltip: `${formatDate(intervalStart)} - ${formatDate(intervalEnd)} (${duration} dia${duration > 1 ? 's' : ''}, ${typeTooltip})`
                });
            }
        }
        i = j - 1;
    }
    
    let longestContinuousLeave = { startDate: null as Date | null, endDate: null as Date | null, totalDays: 0 };
    let currentLeaveStart: Date | null = null;
    let currentLeaveDays = 0;

    timelineSegments.forEach(seg => {
      if (seg.type === 'covered' || seg.type === 'overlapping') {
        if (currentLeaveStart === null) {
          currentLeaveStart = seg.startDate;
        }
        currentLeaveDays += seg.durationDays;
        if (currentLeaveDays > longestContinuousLeave.totalDays) {
          longestContinuousLeave = { startDate: currentLeaveStart, endDate: seg.endDate, totalDays: currentLeaveDays };
        }
      } else { 
        currentLeaveStart = null;
        currentLeaveDays = 0;
      }
    });

    const totalNonCoveredDaysInGaps = timelineSegments.filter(s => s.type === 'gap').reduce((sum, s) => sum + s.durationDays, 0);
    const gapCount = timelineSegments.filter(s => s.type === 'gap').length;
    
    let continuousSequenceCount = 0;
    for(let i = 0; i < certsWithDisplayIdAndStatus.length; i++) {
        if(certsWithDisplayIdAndStatus[i].status === CertificateStatus.CONTINUOUS) {
            continuousSequenceCount++;
        }
    }
    
    const overlappingCertSet = new Set<string>();
    timelineSegments.filter(s => s.type === 'overlapping').forEach(s => {
        s.certificatesInvolved.forEach(certId => overlappingCertSet.add(certId));
    });

    let timelineEffectiveStart: Date | null = null;
    let timelineEffectiveEnd: Date | null = null;
    if (certsWithDisplayIdAndStatus.length > 0) {
        timelineEffectiveStart = certsWithDisplayIdAndStatus[0].startDate;
        timelineEffectiveEnd = certsWithDisplayIdAndStatus.reduce((maxDate, cert) => {
            return cert.endDate.getTime() > maxDate.getTime() ? cert.endDate : maxDate;
        }, certsWithDisplayIdAndStatus[0].endDate);
    }
        
    const analysisData: AnalysisResults = {
      longestContinuousLeave,
      totalCertificates: certsWithDisplayIdAndStatus.length,
      continuousSequenceCount,
      overlappingCertificatesCount: overlappingCertSet.size,
      gapCount,
      totalNonCoveredDaysInGaps,
      timelineSegments: timelineSegments,
      allDates: timelineEffectiveStart && timelineEffectiveEnd ? [timelineEffectiveStart, timelineEffectiveEnd] : []
    };

    return {
        results: analysisData,
        processedCerts: certsWithDisplayIdAndStatus
    };
};

self.onmessage = (e: MessageEvent<MedicalCertificate[]>) => {
  // When data comes into the worker, date objects are serialized as strings.
  // We need to convert them back to Date objects before processing.
  const certsInput = e.data.map(c => ({
    ...c,
    startDate: new Date(c.startDate),
    endDate: new Date(c.endDate),
  }));

  const results = analyzeCertificates(certsInput);
  
  // Post the results back to the main thread. Dates will be serialized again.
  self.postMessage(results);
};
