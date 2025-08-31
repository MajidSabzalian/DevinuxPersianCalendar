class PublicApi{
    constructor() {
        this.Api = PublicApi.Api;
    }
    static Api = {
        toPersianNumber : (s) => (s && s.toString().replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d])),
        toEnglishNumber : (s) => (s && s.toString().replace(/[۰-۹٠-٩]/g, d => "۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩".indexOf(d) % 10))
    }
}
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
    static fromDate(date = new Date()){
        return DevinuxPersianCalendar.gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate() , date.getHours() , date.getMinutes() , date.getSeconds());
    }
}
class DevinuxPersianCalendar extends PublicApi {
	static option = {
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
        width : `300px`,
        dateEditor : true , 
        timeEditor : true ,
	};
	constructor() {
		super();
        this.root = undefined;
        this.e = undefined;

        this.year = 1;
        this.month = 1;
        this.day = 1;
        this.selectedDay = undefined;
        this.selectedMonth = undefined;
        this.selectedYear = undefined;

        this.hour = 1;
        this.minute = 1;
        this.second = 1;
	}
    setOption(overridenObject = {}){
        this.option = { ...this.option, ...overridenObject };
        return this;
    }
	init(element) {
        this.e = $(element);
		this.e.wrap(`<div class="devinux persian-calendar"></div>`);

        this.root = $(this.e).closest(`.persian-calendar`);
        this.root.off().mousedown(e => { this.#open(); });

		this.e.addClass(`hide`).attr({ type: "text" });
        this.e.off().focusin(() => { this.#checkFirstValue(); this.#open(); });
        this.e.change((e)=>{
            this.#checkFirstValue();
            this.#print();
        });

        //this.#print();
        $(document).mouseup((e)=>{ 
            let c = $(e.target).closest(`.persian-calendar`);
            if (c.length == 0 && !$(e.target).is(`.persian-calendar`)) this.#close();
        });
        return this;
	}
    #checkFirstValue(){
        let ev = $(this.e).val().toString()
        let cd = DevinuxPersianCalendarDay.fromDate();
        if (ev.trim().length <= 0) ev = `${cd.year}/${cd.month}/${cd.day} ${cd.hour}:${cd.minute}:${cd.second}`;
        let data = ev.split(/\D+/).filter(Boolean);
        if (data.length >= 3)
        {
            this.year = Number(data[0]);
            this.month = Number(data[1]);
            this.day = Number(data[2]);
            this.hour = Number(data[3] || 0);
            this.minute = Number(data[4] || 0);
            this.second = Number(data[5] || 0);
            if (!this.selected) this.selected = new DevinuxPersianCalendarDay(this.year, this.month, this.day, this.hour, this.minute, this.second, 'fa');
            this.selected.year = Number(data[0]);
            this.selected.month = Number(data[1]);
            this.selected.day = Number(data[2]);
            this.selected.hour = Number(data[3] || 0);
            this.selected.minute = Number(data[4] || 0);
            this.selected.second = Number(data[5] || 0);
        }
    }
	#print() {
		let o = this.#getOption();
        let yc = 100;
        let days = DevinuxPersianCalendar.getShamsiMonthDays( DevinuxPersianCalendar.jalaliToGregorian(this.year,this.month ,1).getDate());
        let fd = days[0];
        if (fd.dayIndex > 0 && fd.dayIndex < 6) days = [...new Array((fd.dayIndex+1)).fill(undefined).map(m=>m), ...days];
        if ($(this.root).find('.calendar').length == 0){
            $(this.root).append(`<div class="calendar flex fix rows" style="width: ${o && o.width ||'300px'}"></div>`)
        }
        let cld = $(this.root).find('.calendar')
        cld.html(``)
		cld.append(`
            ${o && o.dateEditor == true ? `
                <div class="start control flex cols">
                    <div class="end year-down">${o.yearDown || ''}</div>
                    <div class="end month-down">${o.monthDown || ''}</div>
                    <div class="center date">
                        <select class="cmb-month">${Array(12).fill(0).map((m,i)=> new DevinuxPersianCalendarDay(1000,i+1,1,1,1,1,'fa')).map(m=>`<option ${this.month == m.month ? 'selected' : ''} value="${m.month}">${m.monthName}</option>`).join(``)}</select>
                        <select class="cmb-year">${Array(yc).fill(0).map((m,i)=>((this.year-((yc)/2))+i)).map(m=>`<option ${m == this.year ? 'selected' : ''} value="${m}">${m}</option>`).join(``)}</select>
                    </div>
                    <div class="start month-up">${o.monthUp || ''}</div>
                    <div class="start year-up">${o.yearUp || ''}</div>
                </div>
                <div class="center month">
                </div>` : ``}
            ${o && o.timeEditor == true ? `
                <div class="end flex cols times">
                    <div class="center hour">
                        <strong>ساعت</strong>
                        <input type="number" class="h" value="${this.hour}" min="0" max="23" step="1" />
                    </div>
                    <div class="center minute">
                        <strong>دقیقه</strong>
                        <input type="number" class="m" value="${this.minute}" min="0" max="59" step="1" />
                    </div>
                    <div class="center second">
                        <strong>ثانیه</strong>
                        <input type="number" class="s" value="${this.second}" min="0" max="59" step="1" />
                    </div>
                </div>` : ``}
            ${o && o.dateEditor == true ? `
                <div class="menu flex cols">
                    <div class="btn-today start">${o.today || ''}</div>
                </div>
            ` : ``}
        `);
        let c = $(this.root).find('.calendar > .center');
        let weeks = 'شیدسچپج'.split(``)
        weeks.forEach(h => {
            c.append(`<label class="header">${h}</label>`)
        })
        days.forEach((m , i)=>{
            let l = $(`<label data-day-index="${m && m.dayIndex || ''}" data-week="${(Math.floor(i/7)+1)}" class="day"></label>`)
            if (m == undefined)
            {
                l.addClass('')
                c.append(l);
            }
            else
            {
                if (m.currentDay == true) l.addClass('today');
                if (
                    (m.day == ((this.selected && this.selected.day) || (this.day) || 0)) &&
                    (m.month == ((this.selected && this.selected.month) || (this.month) || 0)) &&
                    (m.year == ((this.selected && this.selected.year) || (this.year) || 0)))
                    l.addClass('selected');
                l.html((o && o.formatter(m.day)) || m.day);
                c.append(l);
                l.off().mouseup(() => {
                    c.find('.day').removeClass('selected');
                    l.addClass('selected');
                    this.selected = m;
                    this.#select();
                })
            }
        });
        
        $(this.root).find('.cmb-month').off().change((e)=>{ this.#changeMonth($(e.currentTarget).val());  })
        $(this.root).find('.cmb-year').off().change((e)=>{ this.#changeYear($(e.currentTarget).val()); })
        $(this.root).find('.year-up').off().mousedown(()=>{ this.#nextYear(); })
        $(this.root).find('.year-down').off().mousedown(()=>{ this.#prevYear(); })
        $(this.root).find('.month-up').off().mousedown(()=>{ this.#nextMonth(); })
        $(this.root).find('.month-down').off().mousedown(()=>{ this.#prevMonth(); })
        $(this.root).find('.btn-today').off().mousedown(()=>{ this.#today(); })
        $(this.root).find('.times .h').off().change((e)=>{ if (e.currentTarget.validity.valid) this.#changeHour(e.currentTarget.value); })
        $(this.root).find('.times .m').off().change((e)=>{ if (e.currentTarget.validity.valid) this.#changeMinute(e.currentTarget.value); })
        $(this.root).find('.times .s').off().change((e)=>{ if (e.currentTarget.validity.valid) this.#changeSecond(e.currentTarget.value); })
    }
    #today(){
        let g = DevinuxPersianCalendarDay.fromDate();
        $(this.root).find(`.times .h`).val(g.hour).change();
        $(this.root).find(`.times .m`).val(g.minute).change();
        $(this.root).find(`.times .s`).val(g.second).change();
        this.#select(g);
    }
	#open() { 
        if (!$(this.root).is('.show')){
            $(this.root).addClass(`show`); 
            this.#checkFirstValue();
            this.#print();
        }
        let rect = $(this.e).get(0).getBoundingClientRect();
        const vh = $(window).height() / 2 , vw = $(window).width() / 2;
        const x = (rect.x < vw ? rect.x : rect.x + rect.width);
        const y = (rect.y > vh ? rect.y : rect.y + rect.height);
        const tx = `translateX(${(rect.x > vw ? `-100%` : '0%')})`;
        const ty = `translateY(${(rect.y > vh ? `-100%` : '0%')})`;
        $(this.root).find(`.calendar`).css({ 'left': `${x}px`, 'top': `${y}px`, 'transform': `${tx} ${ty}` });
    }
    #getOption (){
        return { ...DevinuxPersianCalendar.option, ...this.option };
    }
    #select(){
		let o = this.#getOption();
        let m  = this.selected || DevinuxPersianCalendarDay.fromDate();
        m.hour = this.hour;
        m.minute = this.minute;
        m.second = this.second;
        let value  = o && o.valueSetter && o.valueSetter(m) || `${m.year}/${m.month}/${m.day} ${m.hour}:${m.minute}:${m.second}`;
        $(this.e).val(value)
        this.selectedDay = m.day;
        this.selectedMonth = m.month;
        this.selectedYear = m.year;
        if (o && o.onSelect) o.onSelect(m , value);
        if (o && o.closeAfterSelect == true) 
            this.#close();

    }
	#close() { $(this.root).removeClass(`show`); }
    #changeMonth(m){ this.month = Number(m); this.#print(); this.#open(); }
    #changeYear(y){ this.year = Number(y); this.#print(); this.#open(); }
    #changeDay(d){ this.day = Number(d); this.#print(); this.#open(); }
    #changeHour(v){ this.hour = Number(v);  this.#select(); }
    #changeMinute(v){ this.minute = Number(v); this.#select(); }
    #changeSecond(v){ this.second = Number(v); this.#select(); }
    #nextMonth() { this.year = this.month == 12 ? this.year + 1 : this.year; this.month = this.month == 12 ? 1 : this.month + 1; this.#print(); }
    #prevMonth() { this.year = this.month == 1 ? this.year - 1 : this.year; this.month = this.month == 1 ? 12 : this.month - 1; this.#print(); }
    #prevYear() { this.year--; this.#print(); }
    #nextYear() { this.year++; this.#print(); }

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
	static isJalaliLeapYear(year) {
        const matches = [1, 5, 9, 13, 17, 22, 26, 30];
        const modulus = year % 33;
        return matches.includes(modulus)
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
    $(`input`).focus();
});