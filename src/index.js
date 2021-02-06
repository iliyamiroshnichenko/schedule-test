import './sass/styles.scss';
import { v4 as uuidv4 } from 'uuid';
import timeSlotIsBookedError from './js/notifications';
import refs from './js/refs';
import parseLocalSrorage from './js/parseLocalSrorage';

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
  const findCoincidence = parseLocalSrorage().find(
    ({ meetingDay, meetingTime }) => meetingDay === day && meetingTime === time,
  );
  if (findCoincidence) {
    timeSlotIsBookedError();
    event.preventDefault();
  } else {
    localStorage.setItem(uuidv4(), JSON.stringify(newMeeting));
  }
}

function changeRadio() {
  refs.form.elements.teammate.forEach(t => (t.disabled = !t.disabled));
}

function addBasicMarkup(name, time, day) {
  const markup = `<span>${name}</span><button class="btn-close" type="button" data-toggle="modal" data-target="#myModal"></button>`;
  const tableCell = refs.table.querySelector(
    `[data-time='${time}'] > [data-day="${day}"]`,
  );
  tableCell.innerHTML = '';
  tableCell.insertAdjacentHTML('beforeend', markup);
  tableCell.classList.add('active-event');
}

function addAllMarkup() {
  parseLocalSrorage().forEach(({ meetingName, meetingDay, meetingTime }) => {
    if (refs.table) {
      addBasicMarkup(meetingName, meetingTime, meetingDay);
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
        addBasicMarkup(meetingName, meetingTime, meetingDay);
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
