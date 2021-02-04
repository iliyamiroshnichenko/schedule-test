import './sass/styles.scss';
import refs from './js/refs';
import { v4 as uuidv4 } from 'uuid';
import timeSlotIsBookedError from './js/notifications';

addAllMarkup();

if (refs.form) {
  refs.submitButton.addEventListener('click', submitForm);
  refs.form.querySelector('#radio1').addEventListener('change', changeRadio);
  refs.form.querySelector('#radio2').addEventListener('change', changeRadio);
}

if (refs.table) {
  refs.select.addEventListener('change', filterByTeammate);
  refs.table.addEventListener('click', deleteMeeting);
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
      event.preventDefault();
    }
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

function addAllMarkup() {
  parseLocalSrorage().forEach(({ meetingName, meetingDay, meetingTime }) => {
    if (refs.table) {
      const markup = `<span>${meetingName}</span><button class="btn-close" type="button" data-toggle="modal" data-target="#myModal"></button>`;
      const tableCell = refs.table.querySelector(
        `[data-time='${meetingTime}'] > [data-day="${meetingDay}"]`,
      );
      tableCell.innerHTML = '';
      tableCell.insertAdjacentHTML('beforeend', markup);
      tableCell.classList.add('active-event');
    }
  });
}

function filterByTeammate(event) {
  if (event.target.value === 'all-members') {
    addAllMarkup();
    return;
  }
  parseLocalSrorage().forEach(
    ({ meetingMembers, meetingName, meetingDay, meetingTime }) => {
      if (
        meetingMembers.includes(event.target.value) ||
        meetingMembers.includes('all-members')
      ) {
        const markup = `<span>${meetingName}</span><button class="btn-close" type="button" data-toggle="modal" data-target="#myModal"></button>`;
        const tableCell = refs.table.querySelector(
          `[data-time='${meetingTime}'] > [data-day="${meetingDay}"]`,
        );
        tableCell.innerHTML = '';
        tableCell.insertAdjacentHTML('beforeend', markup);
        tableCell.classList.add('active-event');
      } else {
        const tableCell = refs.table.querySelector(
          `[data-time='${meetingTime}'] > [data-day="${meetingDay}"]`,
        );
        tableCell.innerHTML = '';
        tableCell.classList.remove('active-event');
      }
    },
  );
}

function deleteMeeting(event) {
  if (event.target.nodeName !== 'BUTTON') {
    return;
  }
  const parent = event.target.parentNode;
  const day = parent.dataset.day;
  const time = parent.parentNode.dataset.time;
  const tableCell = refs.table.querySelector(
    `[data-time='${time}'] > [data-day="${day}"]`,
  );

  refs.confirmDeletingBtn.addEventListener('click', () => {
    for (let key in localStorage) {
      if (!localStorage.hasOwnProperty(key) || key.length !== 36) {
        continue;
      }
      const value = JSON.parse(localStorage.getItem(key));
      if (value.meetingDay === day && value.meetingTime === time) {
        localStorage.removeItem(key);
        break;
      }
    }
    tableCell.innerHTML = '';
    tableCell.classList.remove('active-event');
  });
}
