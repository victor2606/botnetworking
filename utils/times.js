module.exports = (bot) => {
	formatting = (tbl, string) => {
		for (const i in tbl){
			string = string.replaceAll(`%${i}`, tbl[i]);
		}
		return string;
	}
	padZero = (value) => `${value}`.padStart(2, '0');
	Object.assign(bot.context, {
		differenceTime: async function(time) {
			return Math.abs( new Date().getTime() - time)
		},
		differenceTimeDate: async function(time) {
			return this.mathTime( this.differenceTime(time) )
		},
		mathTime: async function(time) {
			let t = time,
			back = {};
			t /= 1000;	
			back.years = Math.floor( t / 31536000 );
			t %= 31536000;
			back.weeks = Math.floor( t / 604800 );
			t %= 604800;
			back.days = Math.floor( t / 86400 );
			t %= 86400;
			back.hours = Math.floor( t / 3600 );
			t %= 3600;	
			back.minutes = Math.floor( t / 60 );
			t %= 60;	
			back.seconds = Math.floor(t);
			back.str = (back.years ? `${back.years}г ` : '') + 
				(back.weeks ? `${back.weeks}н ` : '') + 
				(back.days ? `${back.days}д ` : '') +
				(back.hours ? `${back.hours}ч ` : '') +
				(back.minutes ? `${back.minutes}м ` : '') + 
				(back.seconds ? `${back.seconds}с ` : ''); 
			return back;
		},
		timer24: async function(time) {
			const start = new Date(time),
				now = new Date(),
				days = Math.floor(((now - start) / 86400000));
			return 75000 + days * 3;
		},
		timeFormat: async function(format, time) {
			time = new Date(time || new Date().getTime());
			return formatting({
				S: time.getMilliseconds(),
				s: padZero(time.getSeconds()),
				m: padZero(time.getMinutes()),
				d: padZero(time.getDate()),
				h: padZero(time.getHours()),
				M: padZero(time.getMonth() + 1),
				y: time.getFullYear()
			}, format)
		},
		utcTimeFormat: async function(format, time) {
			time = new Date(time || new Date().getTime());
			return formatting({
				S: time.getUTCMilliseconds(),
				s: padZero(time.getUTCSeconds()),
				m: padZero(time.getUTCMinutes()),
				d: padZero(time.getUTCDate()),
				h: padZero(time.getUTCHours()),
				M: padZero(time.getUTCMonth() + 1),
				y: time.getUTCFullYear()
			}, format)
		}
	})
}