import './sass/styles.scss';
import refs from './js/refs';
import { v4 as uuidv4 } from 'uuid';
import timeSlotIsBookedError from './js/notifications';

parseLocalSrorage().forEach(({ meetingName, meetingDay, meetingTime }) => {
  console.log(meetingName, meetingDay, meetingTime);
  if (refs.table) {
    const markup = `<span>${meetingName}</span><button class="btn-close" type="button"></button>`;
    const tableCell = refs.table.querySelector(
      `[data-time='${meetingTime}'] > [data-day="${meetingDay}"]`,
    );
    tableCell.insertAdjacentHTML('beforeend', markup);
    tableCell.classList.add('active-event');
  }
});

if (refs.form) {
  refs.submitButton.addEventListener('click', submitForm);
  refs.form.querySelector('#radio1').addEventListener('change', changeRadio);
  refs.form.querySelector('#radio2').addEventListener('change', changeRadio);
}

function submitForm(event) {
  const formElement = refs.form.elements;
  const newEvent = formElement.meeting.value;
  const day = formElement.day.value;
  const time = formElement.time.value;
  const teammateList = [];
  if (formElement.team.value === 'all-members') {
    teammateList.push(formElement.team.value);
  } else {
    formElement.teammate.forEach(c => {
      if (c.checked) {
        teammateList.push(c.value);
      }
    });
  }
  const newMeeting = {
    meetingName: newEvent,
    meetingDay: day,
    meetingTime: time,
    meetingMembers: teammateList,
  };
  let err = false;
  parseLocalSrorage().forEach(({ meetingDay, meetingTime }) => {
    if (meetingDay === day && meetingTime === time) {
      timeSlotIsBookedError();
      err = true;
    }
    event.preventDefault();
    return;
  });
  if (!err) localStorage.setItem(uuidv4(), JSON.stringify(newMeeting));
}

function changeRadio() {
  refs.form.elements.teammate.forEach(t => (t.disabled = !t.disabled));
}

function parseLocalSrorage() {
  const values = [];
  for (let key in localStorage) {
    if (!localStorage.hasOwnProperty(key) || key.length !== 36) {
      continue;
    }
    const value = JSON.parse(localStorage.getItem(key));
    values.push(value);
  }
  return values;
}
