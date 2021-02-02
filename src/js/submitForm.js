import refs from '../js/refs';

refs.submitButton.addEventListener('click', submitForm);
refs.form.querySelector('#radio1').addEventListener('change', changeRadio);
refs.form.querySelector('#radio2').addEventListener('change', changeRadio);

function submitForm(event) {
  event.preventDefault();
  const formElement = refs.form.elements;
  const newEvent = formElement.meeting.value;
  const day = formElement.day.value;
  const time = formElement.time.value;
  const countofTeammates = formElement.team.value;
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
  console.log(newMeeting);
}

function changeRadio() {
  refs.form.elements.teammate.forEach(t => (t.disabled = !t.disabled));
}
