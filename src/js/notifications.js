import { error } from '@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

export default function timeSlotIsBookedError() {
  error({
    text: 'Failed to create an event. Time slot is already booked.',
    delay: 3000,
  });
}
