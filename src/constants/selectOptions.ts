export const places = [
  "Արտաշատ քաղաքում",
  "Մասիս քաղաքում",
  "Վեդի քաղաքում",
  "Հայաստանի շախմատի ակադեմիայում",
  "Տիգրան Պետրոսյանի անվան շախմատի տուն մարզադպրոցում",
];

export const tournaments = [
  "1-ին կարգի",
  "2-րդ կարգի",
  "3-րդ կարգի",
  "4-րդ կարգի",
];

export const months = [
  "հունվար",
  "փետրվար",
  "մարտ",
  "ապրիլ",
  "մայիս",
  "հունիս",
  "հուլիս",
  "օգոստոս",
  "սեպտեմբեր",
  "հոկտեմբեր",
  "նոյեմբեր",
  "դեկտեմբեր",
];

export const days = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
  '12', '13', '14', '15', '16', '17', '18', '19', '20', '21',
  '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
  ;

export const getDaysInMonth = (month: string): number => {
  const monthIndex = months.indexOf(month);
  if (monthIndex === -1) {
    return 31
  };
  const year = new Date().getFullYear();
  return new Date(year, monthIndex + 1, 0).getDate();
};

export const getNextMonth = (month: string): string => {
  const monthIndex = months.indexOf(month);
  if (monthIndex === -1) {
    return month;
  }
  return months[(monthIndex + 1) % 12];
};
