const React = require('react');

// const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const MONTHS = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
const DAYS = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

function plural(string, count, many) {
    if (count == 1) {
        return string;
    } else if (many) {
        return many;
    } else {
        return string + 's';
    }
}

class Timestamp extends React.Component {
    componentDidMount() {
        if (this.props.autoUpdate) {
            const interval = (typeof this.props.autoUpdate === 'number' ? this.props.autoUpdate : 1) * 1000;
            this.updateInterval = setInterval(() => {
                this.forceUpdate();
            }, interval);
        }
    }

    componentWillUnmount() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }

    _distanceOfTimeInWords(date, compare_to) {
        var is_comparing = false;

        if (compare_to) {
            if (compare_to.toDate) compare_to = compare_to.toDate();
            is_comparing = true;
        } else {
            compare_to = new Date();
        }

        var seconds = Math.floor((compare_to.getTime() - date.getTime()) / 1000);
        var is_ago = seconds >= 0;

        seconds = Math.abs(seconds);

        if (!this.props.actualSeconds) {
            if (seconds < 60) {
                // 1 minute
                if (is_comparing) {
                    return is_ago ? 'Just then' : 'Soon';
                } else {
                    return 'A few seconds';
                }
            }
        }

        var distance;
        var when = [];

        if (this.props.precision == 1) {
            if (seconds < 60) {
                // 1 minute
                when = `${seconds} ${plural('second', seconds)}`;
            } else if (seconds < 60 * 60) {
                // 1 hour
                distance = Math.round(seconds / 60);
                when = `${distance} ${plural('minute', distance)}`;
            } else if (seconds < 60 * 60 * 24) {
                // 1 day
                distance = Math.round(seconds / (60 * 60));
                when = `${distance} ${plural('hour', distance)}`;
            } else if (seconds < 60 * 60 * 24 * 7) {
                // 1 week
                distance = Math.round(seconds / (60 * 60 * 24));
                when = `${distance} ${plural('day', distance)}`;
            } else if (seconds < 60 * 60 * 24 * (365 / 12)) {
                // 1 month
                distance = Math.round(seconds / (60 * 60 * 24 * 7));
                when = `${distance} ${plural('week', distance)}`;
            } else if (seconds < 60 * 60 * 24 * 30 * 12) {
                // # 1 year
                distance = Math.round(seconds / (60 * 60 * 24 * (365 / 12)));
                when = `${distance} ${plural('month', distance)}`;
            } else {
                return this._prettyTime(date);
            }
        } else {
            when = [];

            // Years
            const YEAR = 60 * 60 * 24 * 365;
            if (seconds > YEAR) {
                distance = Math.floor(seconds / YEAR);
                when.push(`${distance} ${plural('year', distance)}`);
                seconds -= distance * YEAR;
            }

            // Months
            const MONTH = 60 * 60 * 24 * (365 / 12);
            if (seconds > MONTH) {
                distance = Math.floor(seconds / MONTH);
                when.push(`${distance} ${plural('month', distance)}`);
                seconds -= distance * MONTH;
            }

            // Days
            const DAY = 60 * 60 * 24;
            if (seconds > DAY) {
                distance = Math.floor(seconds / DAY);
                when.push(`${distance} ${plural('day', distance)}`);
                seconds -= distance * DAY;
            }

            // Hours
            const HOUR = 60 * 60;
            if (seconds > HOUR) {
                distance = Math.floor(seconds / HOUR);
                when.push(`${distance} ${plural('hour', distance)}`);
                seconds -= distance * HOUR;
            }

            // Minutes
            const MINUTE = 60;
            if (seconds > MINUTE) {
                distance = Math.floor(seconds / MINUTE);
                when.push(`${distance} ${plural('minute', distance)}`);
                seconds -= distance * MINUTE;
            }

            if (seconds > 0) {
                when.push(`${seconds} ${plural('second', seconds)}`);
            }

            when = when.slice(0, this.props.precision).join(', ');
        }

        if (is_comparing) {
            return when;
        } else if (is_ago) {
            return `${when} ago`;
        } else {
            return `in ${when}`;
        }
    }

    _prettyTime(date) {
        var hours, minutes, ampm;

        // eg. 5 Nov 12, 1:37pm
        if (this.props.twentyFourHour) {
            hours = date.getHours();
            ampm = '';
        } else {
            if (date.getHours() % 12 == 0) {
                hours = 12;
            } else {
                hours = date.getHours() % 12;
            }

            if (date.getHours() > 11) {
                ampm = 'pm';
            } else {
                ampm = 'am';
            }
        }

        if (date.getMinutes() < 10) {
            minutes = '0' + date.getMinutes();
        } else {
            minutes = '' + date.getMinutes();
        }

        var day = this.props.includeDay ? DAYS[date.getDay()] + ', ' : '';

        switch (this.props.format) {
            case 'date':
                return `${day}${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
            case 'time':
                return `${hours}:${minutes}${ampm}`;
            case 'full':
            default:
                return `${day}${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}, ${hours}:${minutes}${ampm}`;
        }
    }

    _parseDate(date) {
        if (date === '' || date === false || date === null) return false;

        if (typeof date === 'number' || '' + parseInt(date, 10) == date) {
            date = parseInt(date, 10);

            if (isNaN(date)) return false;

            date = new Date(date * 1000);
        }

        if (date.toJSON) {
            date = date.toJSON();
        } else {
            date = date.toString();
        }

        var t = date.split(/[:\-\+TZ\. ]/);
        for (var i in t) {
            if (t[i] !== '' && isNaN(parseInt(t[i], 10))) return false;
        }

        var d;

        if (this.props.utc) {
            d = new Date('Sun Jan 01 00:00:00 UTC 2012');
            d.setUTCFullYear(t[0]);
            d.setUTCMonth(t[1] - 1);
            d.setUTCDate(t[2]);
            d.setUTCHours(t[3]);
            d.setUTCMinutes(t[4]);
            d.setUTCSeconds(t[5]);
        } else {
            d = new Date('1/1/1970');
            d.setFullYear(t[0]);
            d.setMonth(t[1] - 1);
            d.setDate(t[2]);
            d.setHours(t[3]);
            d.setMinutes(t[4]);
            d.setSeconds(t[5]);
        }

        return d;
    }

    _formatDate(date) {
        var d = this._parseDate(date);

        if (d === false) {
            // return 'never';
            return '';
        }

        if (
            this.props.format == 'ago' ||
            this.props.format == 'future' ||
            this.props.format == 'relative' ||
            this.props.since ||
            this.props.until
        ) {
            return this._distanceOfTimeInWords(d, this.props.since || this.props.until || null);
        } else {
            return this._prettyTime(d);
        }
    }

    render() {
        return React.createElement(
            this.props.component,
            { className: this.props.className, style: this.props.style },
            this._formatDate(this.props.time)
        );
    }
}

Timestamp.defaultProps = {
    time: new Date(),
    utc: true,
    format: 'ago',
    precision: 1,
    since: null,
    until: null,
    includeDay: false,
    component: 'span',
    className: '',
    style: {},
    autoUpdate: false,
    twentyFourHour: false,
    actualSeconds: false
};

module.exports = Timestamp;