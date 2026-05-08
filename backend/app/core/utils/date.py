from datetime import datetime, date, time, timezone
from typing import Union, Tuple
from zoneinfo import ZoneInfo

from .log import logger

# Define JST timezone
JST = ZoneInfo("Asia/Tokyo")

UTC = ZoneInfo("UTC")

class DateFormat:

    YYYY_MM_DD_T_HH_MM_SS_MINUS = "%Y-%m-%dT%H:%M:%S"

    YYYY_MM_DD_HH_MM_SS = "%Y/%m/%d %H:%M:%S"

    YYYY_MM_DD = "%Y/%m/%d"

    YYYY_MM_DD_MINUS = "%Y-%m-%d"

    YYYY_MM = "%Y/%m"

    YYYY_MM_MINUS = "%Y-%m"

class DateUtils:

    @staticmethod
    def utc() -> datetime:
        return datetime.now(timezone.utc)

    @staticmethod
    def jst_now() -> datetime:
        return datetime.now(JST)
    
    @staticmethod
    def now(
        tz: ZoneInfo = JST,
        replace_microseconds: bool = False,
        replace_tzinfo: bool = True
    ) -> datetime:
        value = datetime.now(tz=tz)
        if replace_microseconds:
            value = value.replace(microsecond=0)
        if replace_tzinfo:
            value = value.replace(tzinfo=None)
        return value

    @staticmethod
    def utc_now(
        replace_microseconds: bool = False,
        replace_tzinfo: bool = False
    ) -> datetime:
        return DateUtils.now(tz=UTC, replace_microseconds=replace_microseconds, replace_tzinfo=replace_tzinfo)
    
    @staticmethod
    def today() -> datetime.date:
        return datetime.today()
    
    @staticmethod
    def convert_str_to_date(
        value,
        input_format=DateFormat.YYYY_MM_DD
    ) -> date:
        try:
            return datetime.strptime(value, input_format).date()
        except Exception as e:
            logger.error(f"convert_str_to_date error: {e}")
            return None

    @staticmethod
    def convert_date_to_str(
        date,
        output_format=DateFormat.YYYY_MM_DD
    ) -> str:
        try:
            return date.strftime(output_format)
        except Exception as e:
            logger.error(f"convert_date_to_str error: {e}")
            return ""

    @staticmethod
    def convert_any_to_str(
        value: Union[str, datetime, date],
        input_format=DateFormat.YYYY_MM_DD_T_HH_MM_SS_MINUS,
        output_format=DateFormat.YYYY_MM_DD_HH_MM_SS
    ) -> str:
        try:
            if isinstance(value, datetime):
                date_value = value
            elif isinstance(value, date):
                # Convert date to datetime
                date_value = datetime.combine(value, datetime.min.time())
            else:
                date_value = datetime.strptime(value, input_format)
            
            string_value = date_value.strftime(output_format)
            return string_value
        except Exception as e:
            logger.error(f"convert_any_to_str error: {e}")
            return ""
        
    @staticmethod
    def convert_str_to_datetime(
        value: str,
        input_format: str = DateFormat.YYYY_MM_DD_T_HH_MM_SS_MINUS
    ) -> datetime:
        try:
            return datetime.strptime(value, input_format)
        except Exception as e:
            logger.error(f"convert_str_to_datetime error: {e}")
            return None
        
    @staticmethod
    def get_start_end_date_time(date: datetime) -> Tuple[datetime, datetime]:
        startDate = datetime.combine(date.date(), time.min)
        endDate = datetime.combine(date.date(), time.max)
        return startDate, endDate
    
    @staticmethod
    def add_seconds(dt: datetime, seconds: int) -> datetime:
        """
        Add seconds to datetime
        
        Args:
            dt: datetime object
            seconds: number of seconds to add
            
        Returns:
            datetime: new datetime with added seconds
        """
        from datetime import timedelta
        return dt + timedelta(seconds=seconds)
    
    @staticmethod
    def add_minutes(dt: datetime, minutes: int) -> datetime:
        """
        Add minutes to datetime
        
        Args:
            dt: datetime object
            minutes: number of minutes to add
            
        Returns:
            datetime: new datetime with added minutes
        """
        from datetime import timedelta
        return dt + timedelta(minutes=minutes)
