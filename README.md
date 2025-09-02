# Devinux Persian Calendar

![Build](https://github.com/MajidSabzalian/DevinuxPersianCalendar/actions/workflows/build.yml/badge.svg)
![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/MajidSabzalian/DevinuxPersianCalendar)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/MajidSabzalian/DevinuxPersianCalendar)

# Demo
This site was built using [GitHub Pages - Demo](https://majidsabzalian.github.io/DevinuxPersianCalendar/).

# Options
create instance 

```
// using component
// create instance
let dt = new DevinuxPersianCalendar();

// element like as  {jquery element} or {#element}
// iniitial for element[input[type]]
dt.init(element);

// change default option
dt.setOption({});
```

option model
```
// option model
{
    position: "abs", // fix
    autoPosition: true,
    calendar: "persian", //'gregorian'
    valueSetter : (d)=>`${d.year}/${d.month}/${d.day} ${d.hour}:${d.minute}:${d.second}`,
    formatter: (v) => PublicApi.Api.toPersianNumber(v),
    onSelect: (d) => {},
    onSet: (d) => {},
    onOpen: (d) => {},
    onClose: (d) => {},
    closeAfterSelect : false,
    min: new Date(2000, 0, 1),
    max: new Date(2100, 0, 1),
    selectionMode: "range", // 'single'
    yearUp:     `<label class="btn"><i class="fal fa-chevrons-left"></i></label>`,
    yearDown:   `<label class="btn"><i class="fal fa-chevrons-right"></i></label>`,
    monthUp:    `<label class="btn"><i class="fal fa-chevron-left"></i></label>`,
    monthDown:  `<label class="btn"><i class="fal fa-chevron-right"></i></label>`,
    today:      `<label class="btn"><i class="fal fa-check"></i><span>امروز</span></label>`,
    showButton: `<label class="btn end"><i class="fad fa-calendar"></i></label>`,
    width : `300px`,
    dateEditor : true , 
    timeEditor : true ,
    showOnFocus : true ,
    showOnButton : true
}
```

change all calendar option
```
DevinuxPersianCalendar.option = {}
```

global using library
```
DevinuxPersianCalendar.gregorianToJalali(gy, gm, gd, h = 0 , m = 0 , s = 0) => convert gregorian to persian and return DevinuxPersianCalendarDay
DevinuxPersianCalendar.jalaliToGregorian(jy, jm, jd , h = 0 , m = 0 , s = 0) => convert persian to gregorian and return DevinuxPersianCalendarDay
DevinuxPersianCalendar.isJalaliLeapYear(year) => check is leap year and return [Boolan]
DevinuxPersianCalendar.getShamsiMonthDays(date) => return List all day's of month from your passed [date = new Date()]

new DevinuxPersianCalendarDay(
    year = 2000,
    month = 1,
    day = 1,
    hour = 0,
    minute = 0,
    second = 0,
    calendar = "en"
)
DevinuxPersianCalendarDay.fromDate(date = new Date()) => return information from your passed date as [DevinuxPersianCalendarDay]
```