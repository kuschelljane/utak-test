import React, { Component } from 'react';

class Progressprops extends Component {
  render() {
    const { label, isSelected } = this.props;

    return (
      <div
        className={`border-b-2 ${isSelected ? 'border-green-900' : 'border-blue-100'} flex flex-col items-start m-2 p-2`}
      >
        <div className='flex flex-row gap-x-3'>
        {isSelected && <span className="text-green-900 font-black">&#10003;</span>}
        <p className={`text-sm ${isSelected ? 'text-green-900' : ''}`}>{label}</p>
        </div>
      </div>
    );
  }
}

export default Progressprops;