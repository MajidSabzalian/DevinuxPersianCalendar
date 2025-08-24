class PublicApi{}
class DevinuxPersianCalendarDay extends PublicApi {
	constructor(year = 2000,month = 1,day = 1,hour = 0,minute = 0,second = 0,calendar = "en") 
    {
		super();
		this.year = year;
		this.month = month;
		this.day = day;
		this.hour = hour;
		this.minute = minute;
		this.second = second;
		this.calendar = calendar;
        this.monthName = '';
        this.dayName = '';
        this.dayIndex = this.getDate().getDay();
        this.currentDay = this.getDate().toLocaleDateString() == new Date().toLocaleDateString() ? true : false;
        switch (calendar){
            default :
            case 'en' : 
                {
                    const gregorianMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                    const weekDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                    this.monthName = gregorianMonths[this.month-1];
                    this.dayName = weekDays[this.dayIndex]
                }
                break;
            case 'fa' : 
                {
                    const shamsiMonths = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
                    const shamsiWeekDays = ["شنبه","یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه"];
                    this.monthName = shamsiMonths[this.month-1];
                    this.dayName = shamsiWeekDays[this.dayIndex]
                }
                break;
        }
	}
    getDate() {
        if (this.calendar == "en") {
			return new Date(this.year, this.month - 1, this.day, this.hour, this.minute, this.second);
		} else if (this.calendar == "fa") {
			return DevinuxPersianCalendar.jalaliToGregorian(this.year, this.month, this.day, this.hour, this.minute, this.second).getDate();
		}
		console.error("unknown calendar type", this);
    }
}
class DevinuxPersianCalendar extends PublicApi {
	static option = {
		position: "abs", // fix
		autoPosition: true,
		calendar: "persian", //'gregorian'
		formatter: (v) => v,
		onSelect: (d) => {},
		onSet: (d) => {},
		onOpen: (d) => {},
		onClose: (d) => {},
		min: new Date(2000, 0, 1),
		max: new Date(2100, 0, 1),
		selectionMode: "range", // 'single'
		yearUp: `<button><i>▼</i><span>سال بعد</span></button>`,
		yearDown: `<button><i>▲</i><span>سال قبل</span></button>`,
		monthUp: `<button><i>◄</i><span>ماه بعد</span></button>`,
		monthDown: `<button><i>►</i><span>ماه قبل</span></button>`,
	};
	constructor() {
		super();
        this.root = undefined;
        this.e = undefined;
        this.year = 1404;
        this.month = 6;
	}
	init(element) {
		console.log(element);
		this.e = $(element);
		$(this.e).wrap(`<div class="devinux persian-calendar"></div>`);
		this.root = $(this.e).closest(`.persian-calendar`);
		this.e.addClass(`hide`).attr({ type: "text" });
		this.#print();
	}
	#print() {
		let o = { ...DevinuxPersianCalendar.option, ...{} };
        let days = DevinuxPersianCalendar.getShamsiMonthDays( DevinuxPersianCalendar.jalaliToGregorian(this.year,this.month ,1).getDate());
        let fd = days[0];
        if (fd.dayIndex > 0 && fd.dayIndex < 6) days = [...new Array((fd.dayIndex+1)).fill(undefined).map(m=>m), ...days];
        $(this.root).find('.calendar').remove();
		$(this.root).append(`
            <div class="calendar flex fix rows">
                <div class="start control flex cols">
                    <div class="end year-down">${o.yearDown}</div>
                    <div class="end month-down">${o.monthDown}</div>
                    <div class="center date">${fd.year}/${fd.monthName}</div>
                    <div class="start month-up">${o.monthUp}</div>
                    <div class="start year-up">${o.yearUp}</div>
                </div>
                <div class="center month">
                </div>
                <div class="end flex cols">
                    <div class="hour"></div>
                    <div class="minute"></div>
                    <div class="second"></div>
                </div>
            </div>
        `);
        let c = $(this.root).find('.calendar > .center');
        let weeks = 'شیدسچپج'.split(``)
        weeks.forEach(h => {
            c.append(`<label class="header">${h}</label>`)
        })
        days.forEach((m , i)=>{
            let l = $(`<label data-week="${Math.ceil(i%7)}" class="day"></label>`)
            if (m == undefined)
            {
                l.addClass('')
                c.append(l);
            }
            else
            {
                if (m.currentDay == true) l.addClass('today');
                l.html((o && o.formatter(m.day)) || m.day);
                c.append(l);
                l.off().click(() => {
                    $(this.e).val(`${m.year}/${m.month}/${m.day}`)
                    if (o && o.onSelect) o.onSelect(m);
                })
            }
        });
        
        $(this.root).find('.year-up').off().click(()=>{ this.#nextYear(); })
        $(this.root).find('.year-down').off().click(()=>{ this.#prevYear(); })
        $(this.root).find('.month-up').off().click(()=>{ this.#nextMonth(); })
        $(this.root).find('.month-down').off().click(()=>{ this.#prevMonth(); })
    }
	#open() {}
    #nextMonth(){ this.year = this.month  == 12 ? this.year + 1 : this.year; this.month = this.month  == 12 ? 1 : this.month + 1; this.#print(); }
    #prevMonth(){ this.year = this.month  == 1 ? this.year - 1 : this.year; this.month = this.month  == 1 ? 12 : this.month - 1; this.#print(); }
    #prevYear(){ this.year--; this.#print(); }
    #nextYear(){ this.year++; this.#print(); }
	#close() {}
	#set() {}
	#select() {}

	static gregorianToJalali(gy, gm, gd, h = 0 , m = 0 , s = 0) {
		var g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
		var jy = gy <= 1600 ? 0 : 979;
		gy -= gy <= 1600 ? 621 : 1600;
		var gy2 = gm > 2 ? gy + 1 : gy;
		var days =
			365 * gy +
			Math.floor((gy2 + 3) / 4) -
			Math.floor((gy2 + 99) / 100) +
			Math.floor((gy2 + 399) / 400) -
			80 +
			gd +
			g_d_m[gm - 1];
		jy += 33 * Math.floor(days / 12053);
		days %= 12053;
		jy += 4 * Math.floor(days / 1461);
		days %= 1461;
		if (days > 365) {
			jy += Math.floor((days - 1) / 365);
			days = (days - 1) % 365;
		}
		var jm =
			days < 186
				? 1 + Math.floor(days / 31)
				: 7 + Math.floor((days - 186) / 30);
		var jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
		return new DevinuxPersianCalendarDay(jy, jm, jd, h, m, s, "fa");
	}
    static jalaliToGregorian(jy, jm, jd , h = 0 , m = 0 , s = 0) {
        var gy, gm, gd;
        var sal_a, days;
        jy += 1595;
        days = -355668 + (365 * jy) + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + jd;
        if (jm < 7) {
            days += (jm - 1) * 31;
        } else {
            days += ((jm - 7) * 30) + 186;
        }
        gy = 400 * Math.floor(days / 146097);
        days %= 146097;
        if (days > 36524) {
            gy += 100 * Math.floor(--days / 36524);
            days %= 36524;
            if (days >= 365) days++;
        }
        gy += 4 * Math.floor(days / 1461);
        days %= 1461;
        if (days > 365) {
            gy += Math.floor((days - 1) / 365);
            days = (days - 1) % 365;
        }
        gd = days + 1;
        var sal_m = [0,31,((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28,
                    31,30,31,30,31,31,30,31,30,31];
        for (gm = 0; gm < 13; gm++) {
            var v = sal_m[gm];
            if (gd <= v) break;
            gd -= v;
        }
        return new DevinuxPersianCalendarDay(gy, gm, gd, h, m, s, "en");
    }
	static isJalaliLeapYear(jy) {
		// الگوریتم تشخیص سال کبیسه در جلالی
		var breaks = [
			-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060,
			2097, 2192, 2262, 2324, 2394, 2456, 3178,
		];
		var bl = breaks.length;
		var gy = jy + 621;
		var leapJ = -14,
			jp = breaks[0],
			jm,
			jump,
			leap;
		for (var i = 1; i < bl; i++) {
			jm = breaks[i];
			jump = jm - jp;
			if (jy < jm) break;
			leapJ += Math.floor(jump / 33) * 8 + Math.floor((jump % 33) / 4);
			jp = jm;
		}
		var n = jy - jp;
		leapJ += Math.floor(n / 33) * 8 + Math.floor(((n % 33) + 3) / 4);
		if (jump % 33 === 4 && jump - n === 4) leapJ++;
		var leapG =
			Math.floor(gy / 4) -
			Math.floor(((Math.floor(gy / 100) + 1) * 3) / 4) -
			150;
		leap = leapJ - leapG;
		return ((leap + 1) % 33) - 1 < 0 ? false : ((leap + 1) % 33) - 1 < 4;
	}
    static getShamsiMonthDays(date) {
        let e = DevinuxPersianCalendar.gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
        let daysInMonth;
        if (e.month <= 6) daysInMonth = 31;
        else if (e.month <= 11) daysInMonth = 30;
        else daysInMonth = DevinuxPersianCalendar.isJalaliLeapYear(e.year) ? 30 : 29;
        const result = [];
        for (let d = 1; d <= daysInMonth; d++) {
            result.push(new DevinuxPersianCalendarDay(e.year, e.month, d, date.getHours(), date.getMinutes(), date.getSeconds(), "fa"));
        }
        return result;
    }
}


$(document).ready(()=>{
    $(`input`).each((i,e) => { new DevinuxPersianCalendar().init(e); });
});