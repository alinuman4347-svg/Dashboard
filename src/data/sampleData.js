/**
 * Data mirrored from the Andrew Team Google Sheet — Tab 2.
 * Source: https://docs.google.com/spreadsheets/d/1RCNHuYKto29z3NarNNUA4S_OlYoHZSjAhfIufY4Jybs
 * Sheet tab gid=1409789558
 *
 * Dates are stored as YYYY-MM-DD to avoid DD/MM vs MM/DD ambiguity.
 * Compensatory Date "Yes" means the comp day was already granted (= Completed).
 * Compensatory Date empty means comp day not yet assigned (= Not Added).
 */
export const RAW_DATA = [
  // April 2026
  { date: '2026-04-09', employeeName: 'Muneeb ilyas',    startTime: '2:00 PM',  endTime: '4:00 PM',  totalHours: '2 Hours',          muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-04-12', employeeName: 'Iqra Ali',        startTime: '6:00 PM',  endTime: '7:00 PM',  totalHours: '1 hour',           muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-04-16', employeeName: 'Iqra Ali',        startTime: '3:30 PM',  endTime: '4:30 PM',  totalHours: '1 hour',           muneebApproval: 'Yes', compensatoryDate: 'Yes' },
  { date: '2026-04-19', employeeName: 'Iqra Ali',        startTime: '4:30 PM',  endTime: '6:30 PM',  totalHours: '2 hours',          muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-04-18', employeeName: 'Taha Ahmad',      startTime: '6:15 PM',  endTime: '7:30 PM',  totalHours: '1 hour 15 mins',   muneebApproval: 'Yes', compensatoryDate: 'Yes' },
  { date: '2026-04-21', employeeName: 'Numan Ali',       startTime: '1:15 PM',  endTime: '2:00 PM',  totalHours: '45 mins',          muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-04-25', employeeName: 'Numan Ali',       startTime: '12:10 AM', endTime: '1:15 AM',  totalHours: '1 hour5 mins',     muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-04-23', employeeName: 'Taha Ahmad',      startTime: '6:15 PM',  endTime: '7:30 PM',  totalHours: '1 hour',           muneebApproval: 'Yes', compensatoryDate: 'Yes' },
  { date: '2026-04-25', employeeName: 'Taha Ahmad',      startTime: '2:00 PM',  endTime: '10:00 PM', totalHours: '1 hours 30 min',   muneebApproval: 'Yes', compensatoryDate: 'Yes' },
  { date: '2026-04-25', employeeName: 'Taha Ahmad',      startTime: '2:00 PM',  endTime: '10:00 PM', totalHours: '5 hours',          muneebApproval: 'Yes', compensatoryDate: 'Yes' },
  { date: '2026-04-25', employeeName: 'Taha Ahmad',      startTime: '2:00 PM',  endTime: '10:00 PM', totalHours: '3 hours',          muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-04-25', employeeName: 'Taha Ahmad',      startTime: '5:00 PM',  endTime: '6:00 AM',  totalHours: '9Hours',           muneebApproval: 'Yes', compensatoryDate: 'Yes' },
  { date: '2026-04-25', employeeName: 'Iqra Ali',        startTime: '2:00 PM',  endTime: '3:30 PM',  totalHours: '1.5 hours',        muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-04-26', employeeName: 'Iqra Ali',        startTime: '7:00 PM',  endTime: '8:00 PM',  totalHours: '1 hour',           muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-04-26', employeeName: 'Usman',           startTime: '2:00 AM',  endTime: '3:00 AM',  totalHours: '1 Hour',           muneebApproval: 'Yes', compensatoryDate: 'Yes' },
  { date: '2026-04-26', employeeName: 'Usman',           startTime: '2:00 AM',  endTime: '5:30 AM',  totalHours: '3 Hours 30 min',   muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-04-27', employeeName: 'Taha Ahmad',      startTime: '1:15 PM',  endTime: '4:15 AM',  totalHours: '3 Hours 30 mins',  muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-04-29', employeeName: 'Taha Ahmad',      startTime: '1:30 AM',  endTime: '3:15 AM',  totalHours: '1 Hours 45 mins',  muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-04-29', employeeName: 'Usman',           startTime: '2:00 AM',  endTime: '3:25 AM',  totalHours: '1 Hour 25 min',    muneebApproval: 'Yes', compensatoryDate: ''    },

  // May 2026
  { date: '2026-05-03', employeeName: 'Suleman',         startTime: '2:00 PM',  endTime: '2:30 PM',  totalHours: '30min',            muneebApproval: 'Yes', compensatoryDate: 'Yes' },
  { date: '2026-05-03', employeeName: 'Suleman',         startTime: '2:30 PM',  endTime: '5:55 PM',  totalHours: '3 HOURS 25 MIN',   muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-05-05', employeeName: 'Iqra Ali',        startTime: '10:30 PM', endTime: '11:30 PM', totalHours: '1 hour',           muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-05-05', employeeName: 'Numan Ali',       startTime: '11:30 AM', endTime: '1:00 PM',  totalHours: '1 hour30  mins',   muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-05-08', employeeName: 'Usman',           startTime: '11:17',    endTime: '12:55 PM', totalHours: '1 hour 28 mins',   muneebApproval: 'Yes', compensatoryDate: 'Yes' },
  { date: '2026-05-09', employeeName: 'Iqra Ali',        startTime: '1:00 PM',  endTime: '5:30 PM',  totalHours: '4 hours 30 mins',  muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-05-09', employeeName: 'Husnain Bashir',  startTime: '1:00 PM',  endTime: '2:00 PM',  totalHours: '1 hours',          muneebApproval: 'Yes', compensatoryDate: 'Yes' },
  { date: '2026-05-09', employeeName: 'Husnain Bashir',  startTime: '2:00 PM',  endTime: '5:30 PM',  totalHours: '3 hours 30 mins',  muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-05-09', employeeName: 'Numan Ali',       startTime: '1:00 PM',  endTime: '5:30 PM',  totalHours: '4 hours 30 mins',  muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-05-09', employeeName: 'Husnain Bashir',  startTime: '8:00 PM',  endTime: '1:00 AM',  totalHours: '6hours',           muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-05-09', employeeName: 'Numan Ali',       startTime: '8:00 PM',  endTime: '11:30 PM', totalHours: '4 hours 30 mins',  muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-05-09', employeeName: 'Iqra Ali',        startTime: '7:00 PM',  endTime: '9:00 PM',  totalHours: '2 hours',          muneebApproval: 'Yes', compensatoryDate: 'Yes' },
  { date: '2026-05-10', employeeName: 'Numan Ali',       startTime: '7:00 PM',  endTime: '8:30 PM',  totalHours: '1hours 30 mins',   muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-05-11', employeeName: 'Muneeb Shafiq',   startTime: '10:00 PM', endTime: '4:00 AM',  totalHours: '6 hours',          muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-05-17', employeeName: 'Iqra Ali',        startTime: '10:00 AM', endTime: '11:00 AM', totalHours: '1 hour',           muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-05-16', employeeName: 'suleman butt',    startTime: '8:20 PM',  endTime: '9:30 PM',  totalHours: '1 HOUR 10 min',    muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-05-19', employeeName: 'Muneeb Shafiq',   startTime: '10:38 AM', endTime: '11:42 AM', totalHours: '1 hour 4 min',     muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-05-26', employeeName: 'Numan Ali',       startTime: '11:30 AM', endTime: '1:00 PM',  totalHours: '1 hour30  mins',   muneebApproval: 'Yes', compensatoryDate: ''    },
  { date: '2026-05-26', employeeName: 'Marwa',           startTime: '11:30 AM', endTime: '1:00 PM',  totalHours: '1 hour30  mins',   muneebApproval: 'Yes', compensatoryDate: ''    },
];
