import { RealtimeAgent, tool } from '@openai/agents/realtime';
import { mockPatients } from './mockData';

export const appointmentSpecialistAgent = new RealtimeAgent({
  name: 'appointmentSpecialist',
  voice: 'sage',
  handoffDescription:
    'Appointment scheduling specialist for routine dental appointments, cleanings, and procedures.',

  instructions: `
# Personality and Tone
## Identity
You are the dedicated appointment scheduling specialist at Estrabillo Dental Clinic. You're highly organized, patient-focused, and skilled at finding appointment times that work perfectly for both patients and the clinic's schedule.

## Task
Handle all routine appointment scheduling, including cleanings, exams, consultations, and planned procedures. Ensure patients have all necessary information for their visits.

## Demeanor
Organized, helpful, and accommodating. You take pride in making the scheduling process smooth and stress-free for patients.

## Tone
Professional and friendly, with a focus on being helpful and finding solutions that work for everyone.

## Pacing
Efficient but not rushed - you want to ensure all details are correct and patients feel confident about their appointments.

# Instructions
- Greet with "Hi! I'm here to help you schedule your dental appointment. What type of visit are you looking for today?"
- Always ask about the type of appointment needed first
- Check patient preferences for timing
- Confirm all appointment details by repeating them back
- Provide pre-appointment instructions
- Ask about insurance for new patients or procedure appointments
- Offer appointment reminders via text or email

# Appointment Scheduling Process
1. Determine appointment type and estimated duration
2. Check patient availability preferences
3. Present available options
4. Confirm selected appointment time
5. Collect or verify patient contact information
6. Provide pre-appointment instructions
7. Offer reminder preferences

# Pre-Appointment Instructions
## Routine Cleaning
- Arrive 15 minutes early for check-in
- Bring insurance card and ID
- Continue normal oral hygiene routine

## New Patient Exam
- Arrive 30 minutes early for paperwork
- Bring insurance card, ID, and list of current medications
- Bring previous dental X-rays if available

## Procedures (Fillings, Crowns, etc.)
- Arrive 15 minutes early
- Eat a light meal beforehand
- Arrange transportation if sedation is involved
- Bring insurance pre-authorization if required

# Sample Responses
- "I can schedule your routine cleaning. Do you prefer morning or afternoon appointments?"
- "Perfect! I have you scheduled for Tuesday, March 15th at 10:00 AM for a routine cleaning with Dr. Estrabillo."
- "For your filling appointment, please eat a light meal beforehand and plan for about an hour at the clinic."
`,

  tools: [
    tool({
      name: 'checkRoutineAvailability',
      description: 'Check available appointment slots for routine dental services.',
      parameters: {
        type: 'object',
        properties: {
          appointment_type: {
            type: 'string',
            enum: ['cleaning', 'exam', 'consultation', 'filling', 'crown_prep', 'crown_placement', 'followup'],
            description: 'Type of routine appointment',
          },
          preferred_timeframe: {
            type: 'string',
            enum: ['this_week', 'next_week', 'next_two_weeks', 'next_month', 'flexible'],
            description: 'When patient would like to be seen',
          },
          time_preference: {
            type: 'string',
            enum: ['morning', 'afternoon', 'no_preference'],
            description: 'Time of day preference',
          },
          day_preferences: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
            },
            description: 'Preferred days of the week',
          },
        },
        required: ['appointment_type', 'preferred_timeframe'],
        additionalProperties: false,
      },
      execute: async (input: any) => {
        const { appointment_type, time_preference, day_preferences } = input;
        
        // Mock availability data for next 2 weeks
        const mockAvailability = [
          { date: '2025-01-15', day: 'Wednesday', time: '9:00 AM', available: true },
          { date: '2025-01-15', day: 'Wednesday', time: '2:00 PM', available: true },
          { date: '2025-01-16', day: 'Thursday', time: '10:30 AM', available: true },
          { date: '2025-01-16', day: 'Thursday', time: '3:00 PM', available: true },
          { date: '2025-01-17', day: 'Friday', time: '8:30 AM', available: true },
          { date: '2025-01-17', day: 'Friday', time: '1:30 PM', available: true },
          { date: '2025-01-20', day: 'Monday', time: '9:30 AM', available: true },
          { date: '2025-01-20', day: 'Monday', time: '4:00 PM', available: true },
          { date: '2025-01-21', day: 'Tuesday', time: '11:00 AM', available: true },
          { date: '2025-01-21', day: 'Tuesday', time: '2:30 PM', available: true },
          { date: '2025-01-22', day: 'Wednesday', time: '10:00 AM', available: true },
          { date: '2025-01-23', day: 'Thursday', time: '9:00 AM', available: true },
          { date: '2025-01-24', day: 'Friday', time: '3:30 PM', available: true },
        ];

        // Filter based on preferences
        let filteredSlots = mockAvailability;
        
        if (time_preference === 'morning') {
          filteredSlots = filteredSlots.filter(slot => 
            parseInt(slot.time.split(':')[0]) < 12
          );
        } else if (time_preference === 'afternoon') {
          filteredSlots = filteredSlots.filter(slot => 
            parseInt(slot.time.split(':')[0]) >= 12
          );
        }

        if (day_preferences && day_preferences.length > 0) {
          filteredSlots = filteredSlots.filter(slot =>
            day_preferences.includes(slot.day.toLowerCase())
          );
        }

        // Get appointment duration
        const durations = {
          cleaning: '60 minutes',
          exam: '45 minutes',
          consultation: '30 minutes',
          filling: '60 minutes',
          crown_prep: '60 minutes',
          crown_placement: '45 minutes',
          followup: '30 minutes'
        };

        return {
          available_appointments: filteredSlots.slice(0, 6),
          appointment_duration: durations[appointment_type as keyof typeof durations],
          booking_note: 'Please let me know which time works best for you.'
        };
      },
    }),

    tool({
      name: 'scheduleAppointment',
      description: 'Book a routine dental appointment.',
      parameters: {
        type: 'object',
        properties: {
          patient_phone: {
            type: 'string',
            description: 'Patient phone number',
          },
          patient_name: {
            type: 'string',
            description: 'Patient full name',
          },
          appointment_type: {
            type: 'string',
            description: 'Type of appointment being scheduled',
          },
          appointment_date: {
            type: 'string',
            description: 'Selected appointment date (YYYY-MM-DD)',
          },
          appointment_time: {
            type: 'string',
            description: 'Selected appointment time (e.g., 9:00 AM)',
          },
          is_new_patient: {
            type: 'boolean',
            description: 'Whether this is a new patient',
          },
          insurance_provider: {
            type: 'string',
            description: 'Patient insurance provider (if known)',
          },
          reminder_preference: {
            type: 'string',
            enum: ['text', 'email', 'phone', 'none'],
            description: 'How patient prefers to receive appointment reminders',
          },
        },
        required: ['patient_phone', 'patient_name', 'appointment_type', 'appointment_date', 'appointment_time'],
        additionalProperties: false,
      },
      execute: async (input: any) => {
        const { 
          patient_name, 
          appointment_type, 
          appointment_date, 
          appointment_time,
          is_new_patient,
          reminder_preference 
        } = input;
        
        const appointmentId = `APPT-${Date.now()}`;
        
        // Format date for confirmation
        const dateObj = new Date(appointment_date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });

        // Get pre-appointment instructions
        let instructions = '';
        if (is_new_patient) {
          instructions = 'Please arrive 30 minutes early to complete new patient paperwork. Bring your insurance card, ID, and a list of current medications.';
        } else {
          instructions = 'Please arrive 15 minutes early for check-in. Bring your insurance card and ID.';
        }

        return {
          appointment_id: appointmentId,
          confirmation: `Appointment confirmed for ${patient_name} on ${formattedDate} at ${appointment_time} for ${appointment_type}`,
          appointment_details: {
            patient: patient_name,
            date: formattedDate,
            time: appointment_time,
            type: appointment_type,
            provider: 'Dr. Estrabillo',
            duration: appointment_type === 'cleaning' ? '60 minutes' : 
                     appointment_type === 'exam' ? '45 minutes' : 
                     appointment_type === 'consultation' ? '30 minutes' : '60 minutes'
          },
          pre_appointment_instructions: instructions,
          clinic_info: {
            address: '123 Dental Plaza, Suite 200, Your City, State 12345',
            phone: '(555) 123-DENT',
            parking: 'Free parking available in front of building'
          },
          reminder_setup: reminder_preference !== 'none' ? 
            `You will receive appointment reminders via ${reminder_preference}` : 
            'No reminders will be sent'
        };
      },
    }),

    tool({
      name: 'rescheduleAppointment',
      description: 'Reschedule an existing appointment.',
      parameters: {
        type: 'object',
        properties: {
          patient_phone: {
            type: 'string',
            description: 'Patient phone number to look up existing appointment',
          },
          current_appointment_date: {
            type: 'string',
            description: 'Current appointment date to reschedule',
          },
          new_preferred_timeframe: {
            type: 'string',
            enum: ['this_week', 'next_week', 'next_two_weeks', 'flexible'],
            description: 'When patient would like to reschedule to',
          },
        },
        required: ['patient_phone'],
        additionalProperties: false,
      },
      execute: async (input: any) => {
        const { current_appointment_date } = input;
        
        // Mock existing appointment lookup
        const existingAppointment = {
          appointment_id: 'APPT-12345',
          date: current_appointment_date || '2025-01-20',
          time: '10:00 AM',
          type: 'cleaning',
          patient_name: 'Maria Rodriguez'
        };

        // Mock new availability
        const newSlots = [
          { date: '2025-01-22', day: 'Wednesday', time: '9:00 AM' },
          { date: '2025-01-22', day: 'Wednesday', time: '2:00 PM' },
          { date: '2025-01-23', day: 'Thursday', time: '10:30 AM' },
          { date: '2025-01-24', day: 'Friday', time: '1:30 PM' },
          { date: '2025-01-27', day: 'Monday', time: '9:30 AM' },
        ];

        return {
          current_appointment: existingAppointment,
          available_reschedule_slots: newSlots,
          cancellation_policy: 'Please provide at least 24 hours notice for cancellations to avoid fees.',
          rescheduling_note: 'Which of these new times would work better for you?'
        };
      },
    }),
  ],

  handoffs: [], // populated in index.ts
});