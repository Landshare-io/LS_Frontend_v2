import React from 'react';
import numeral from 'numeral';
import ProgressBar from '../../common/progressbar';

interface ReparingStatusProps {
  max: number
  now: number
}

export default function ReparingStatus({ max, now }: ReparingStatusProps) {
  const showNow = Number(numeral(Number(now)).format('0.[0]'))

  return (
    <div className='progress-content-show w-[100%]'>
      {max > 100 ? (
        showNow > 100 ? (
          <ProgressBar min={0} max={max} now={showNow} label={`${showNow}%`} animated={true} />
        ) : (
          <div className='d-flex w-100'>
            <div style={{ width: ((100 / max) * 100) + '%' }} className='empty-status'>
              <ProgressBar min={0} max={100} now={showNow} label={`${showNow}%`} animated={true} />
            </div>
            <div style={{ width: ((100 * (max - 100)) / max) + '%' }} className='empty-status-progress'>
            </div>
          </div>
        )
      ) : (
        <ProgressBar min={0} max={max} now={showNow} label={`${showNow}%`} animated={true} />
      )}
    </div>
  );
};
