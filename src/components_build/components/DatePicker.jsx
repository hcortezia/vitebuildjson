import React from 'react';
import { DatePicker } from 'antd';
import withListeners from '../../utils/withListeners';

// Componente de DatePicker
const DatePickerBuild = withListeners(({ config }) => {
    const { 
      placeholder, 
      disabled, 
      allowClear = true,
      value,
      onChange,
      onBlur,
      onFocus,
      style,
      className,
      format,
      showTime,
      picker = 'date',
      size
    } = config;
    
    const datePickerTypes = {
      'date': DatePicker,
      'week': DatePicker.WeekPicker,
      'month': DatePicker.MonthPicker,
      'quarter': DatePicker.QuarterPicker,
      'year': DatePicker.YearPicker,
      'range': DatePicker.RangePicker
    };
    
    const DatePickerComponent = datePickerTypes[picker] || DatePicker;
    
    return (
      <DatePickerComponent
        placeholder={placeholder}
        disabled={disabled}
        allowClear={allowClear}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        style={style}
        className={className}
        format={format}
        showTime={showTime}
        size={size}
      />
    );
  });

export default DatePickerBuild;