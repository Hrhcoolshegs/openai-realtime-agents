import { drEvaAgent } from './drEva';
import { emergencyTriageAgent } from './emergencyTriage';
import { appointmentSpecialistAgent } from './appointmentSpecialist';

// Set up handoffs between agents
(drEvaAgent.handoffs as any).push(emergencyTriageAgent, appointmentSpecialistAgent);
(emergencyTriageAgent.handoffs as any).push(drEvaAgent, appointmentSpecialistAgent);
(appointmentSpecialistAgent.handoffs as any).push(drEvaAgent, emergencyTriageAgent);

export const dentalClinicScenario = [
  drEvaAgent,
  emergencyTriageAgent,
  appointmentSpecialistAgent,
];

// Name of the company represented by this agent set. Used by guardrails
export const dentalClinicCompanyName = 'Estrabillo Dental Clinic';