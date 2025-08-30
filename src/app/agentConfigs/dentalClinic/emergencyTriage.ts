import { RealtimeAgent, tool } from '@openai/agents/realtime';

export const emergencyTriageAgent = new RealtimeAgent({
  name: 'emergencyTriage',
  voice: 'sage',
  handoffDescription:
    'Emergency triage specialist that assesses dental emergencies, determines severity, and coordinates immediate care.',

  instructions: `
# Personality and Tone
## Identity
You are Dr. Eva's emergency triage specialist at Estrabillo Dental Clinic. You have extensive training in dental emergency assessment and are skilled at quickly determining the severity of dental situations while keeping patients calm.

## Task
Your primary role is to assess dental emergencies, determine their severity on a 1-10 scale, and coordinate appropriate immediate care or scheduling.

## Demeanor
Calm, reassuring, and efficient. You understand that patients calling with emergencies are often in pain or distressed, so you prioritize making them feel heard and cared for.

## Tone
Professional and compassionate, with a sense of urgency appropriate to the situation. You speak clearly and confidently to help patients feel they're in capable hands.

## Level of Formality
Professional medical tone while remaining approachable and easy to understand.

## Pacing
Speak efficiently but not rushed - patients need to feel you're taking their emergency seriously while moving quickly to help them.

# Emergency Assessment Instructions
- Always start by acknowledging their emergency: "I understand you're having a dental emergency. I'm here to help assess your situation and get you the care you need."
- Ask specific questions to determine severity
- Use the triageEmergency tool to log the assessment
- Provide immediate care instructions when appropriate
- Schedule emergency appointments for severe cases
- Reassure patients throughout the process

# Severity Scale (1-10)
- 1-3: Minor discomfort, can wait for regular appointment
- 4-6: Moderate pain/issue, should be seen within 24-48 hours
- 7-8: Severe pain/issue, needs same-day appointment
- 9-10: Extreme emergency, needs immediate attention

# Emergency Questions to Ask
1. "Can you describe the pain or problem you're experiencing?"
2. "On a scale of 1-10, how would you rate your pain level?"
3. "When did this start?"
4. "Is there any swelling in your face or jaw?"
5. "Are you experiencing any bleeding?"
6. "Have you taken any pain medication, and did it help?"
7. "Do you have a fever?"

# Immediate Care Instructions
## For Severe Pain (7-10)
- Take over-the-counter pain medication as directed on package
- Apply cold compress to outside of cheek for 15-20 minutes
- Avoid very hot or cold foods and drinks
- Do not apply heat to the area

## For Bleeding
- Rinse gently with warm salt water
- Apply gentle pressure with clean gauze
- Avoid spitting or using straws

## For Knocked Out Tooth
- Handle tooth by crown only, not the root
- Rinse gently if dirty, do not scrub
- Try to reinsert if possible, or store in milk
- Seek immediate care

# Sample Responses
- "I can hear that you're in significant pain. Let me ask a few quick questions to assess your situation and get you the help you need."
- "Based on what you've described, this sounds like a [severity level] emergency. I'm going to schedule you for an immediate appointment."
- "While we prepare your emergency appointment, here's what you can do right now to help manage the pain..."
`,

  tools: [
    tool({
      name: 'triageEmergency',
      description: 'Assess and log a dental emergency with severity scoring and recommended action.',
      parameters: {
        type: 'object',
        properties: {
          patient_phone: {
            type: 'string',
            description: 'Patient phone number',
          },
          symptoms: {
            type: 'string',
            description: 'Description of symptoms reported by patient',
          },
          pain_level: {
            type: 'number',
            description: 'Pain level on 1-10 scale as reported by patient',
            minimum: 1,
            maximum: 10,
          },
          severity_assessment: {
            type: 'number',
            description: 'Clinical severity assessment on 1-10 scale',
            minimum: 1,
            maximum: 10,
          },
          recommended_action: {
            type: 'string',
            enum: ['immediate_care', 'same_day_appointment', 'urgent_appointment', 'regular_appointment'],
            description: 'Recommended level of care based on assessment',
          },
        },
        required: ['patient_phone', 'symptoms', 'pain_level', 'severity_assessment', 'recommended_action'],
        additionalProperties: false,
      },
      execute: async (input: any) => {
        const { _patient_phone, _symptoms, _pain_level, severity_assessment, recommended_action } = input;
        
        // Mock emergency triage response
        const emergencyId = `EMG-${Date.now()}`;
        
        let next_steps = '';
        let appointment_time = '';
        
        switch (recommended_action) {
          case 'immediate_care':
            next_steps = 'Patient needs to come in immediately. Dr. Estrabillo will see them as soon as they arrive.';
            appointment_time = 'Immediately - please come in now';
            break;
          case 'same_day_appointment':
            next_steps = 'Schedule patient for same-day emergency appointment.';
            appointment_time = 'Today at 4:30 PM (emergency slot)';
            break;
          case 'urgent_appointment':
            next_steps = 'Schedule patient within 24 hours.';
            appointment_time = 'Tomorrow at 9:00 AM';
            break;
          case 'regular_appointment':
            next_steps = 'Can be scheduled for regular appointment within a few days.';
            appointment_time = 'Next available: Friday at 2:00 PM';
            break;
        }

        return {
          emergency_id: emergencyId,
          severity_score: severity_assessment,
          recommended_action,
          next_steps,
          appointment_time,
          immediate_care_instructions: severity_assessment >= 7 ? 
            'Take over-the-counter pain medication as directed. Apply cold compress to outside of cheek. Avoid hot/cold foods.' : 
            'Continue current pain management. Avoid chewing on affected side.',
        };
      },
    }),

    tool({
      name: 'scheduleEmergencyAppointment',
      description: 'Schedule an emergency dental appointment.',
      parameters: {
        type: 'object',
        properties: {
          patient_phone: {
            type: 'string',
            description: 'Patient phone number',
          },
          appointment_type: {
            type: 'string',
            enum: ['emergency_immediate', 'emergency_same_day', 'urgent_care'],
            description: 'Type of emergency appointment needed',
          },
          symptoms_summary: {
            type: 'string',
            description: 'Brief summary of patient symptoms',
          },
        },
        required: ['patient_phone', 'appointment_type', 'symptoms_summary'],
        additionalProperties: false,
      },
      execute: async (input: any) => {
        const { _patient_phone, appointment_type, _symptoms_summary } = input;
        
        const appointmentId = `APPT-EMG-${Date.now()}`;
        
        let appointment_details = {};
        
        switch (appointment_type) {
          case 'emergency_immediate':
            appointment_details = {
              time: 'Immediately',
              instructions: 'Please come to the clinic right away. Dr. Estrabillo will see you as soon as you arrive.',
              estimated_wait: '0-15 minutes'
            };
            break;
          case 'emergency_same_day':
            appointment_details = {
              time: 'Today at 4:30 PM',
              instructions: 'Please arrive 15 minutes early for check-in.',
              estimated_wait: '0-10 minutes'
            };
            break;
          case 'urgent_care':
            appointment_details = {
              time: 'Tomorrow at 9:00 AM',
              instructions: 'Please arrive 15 minutes early. Bring your insurance card.',
              estimated_wait: '5-15 minutes'
            };
            break;
        }

        return {
          appointment_id: appointmentId,
          confirmation: `Emergency appointment scheduled for ${appointment_details.time}`,
          ...appointment_details,
          clinic_address: '123 Dental Plaza, Suite 200, Your City, State 12345',
          emergency_contact: '(555) 999-DENT for after-hours emergencies'
        };
      },
    }),
  ],

  handoffs: [], // populated in index.ts
});