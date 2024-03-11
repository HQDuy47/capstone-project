import { useMutation } from '@apollo/client';
import React from 'react';

import { Button } from '@/components/Button';
import { IconCheckCircle, IconLoader } from '@/components/Icons';
import { UPDATE_JOB_STATUS } from '@/graphql/jobs-applied';
import { cn } from '@/lib/classNames';
import { useLocale } from '@/locale';

import PDFDownloader from './PDFDowloader';

interface JobAppliedDetailsProps {
  id: string;
  title: string;
  imageUrl: string;
  applicantName: string;
  applicantEmail: string;
  applicationDate: string;
  status: string;
  coverLetter: string;
  nameCV: string;
  onUpdateStatus: (newStatus: string) => void;
}

const JobAppliedDetails: React.FC<JobAppliedDetailsProps> = ({
  id,
  title,
  imageUrl,
  applicantName,
  applicantEmail,
  applicationDate,
  status,
  coverLetter,
  nameCV,
  onUpdateStatus,
}) => {
  const { t } = useLocale();
  console.log(id);
  const [updateJobApplication, { loading: updatingStatus }] =
    useMutation(UPDATE_JOB_STATUS);

  const statusIcons: { [key: string]: JSX.Element } = {
    Accepted: <IconCheckCircle className='h-4 w-4' />,
    Submitting: <IconLoader className='h-4 w-4 ' />,
  };

  const handleChangeStatus = () => {
    const newStatus = 'Accepted';
    updateJobApplication({
      variables: {
        input: {
          status: newStatus,
        },
        updateJobApplicationId: id,
      },
    })
      .then(() => {
        onUpdateStatus(newStatus);
      })
      .catch((error) => {
        console.error('Error updating job application status:', error);
      });
  };

  return (
    <div className='relative '>
      <div className='rounded-md border border-gray-200 bg-white px-6 py-4 shadow-sm'>
        <p className='text-[20px] font-[600] leading-normal'>{title}</p>
      </div>
      <div className='mt-2 h-[700px] overflow-auto rounded-md border border-gray-200 bg-white px-6 py-6 shadow-sm'>
        <div className='items-cente flex flex-row items-center justify-between gap-4'>
          <div className='w-1/12'>
            <img src={imageUrl} alt='User' className='h-16 w-16 rounded-full' />
          </div>
          <div className='flex w-11/12 flex-row justify-between'>
            <div>
              <p className='text-[18px] font-[600] '>{applicantName}</p>
              <p className='text-rich-grey mt-1'>{applicantEmail}</p>
              <div
                className={cn(
                  'mt-1 flex items-center gap-2 text-[16px] font-[500]',
                  {
                    'text-green': status === 'Accepted',
                    'text-blue': status === 'Submitting',
                  }
                )}
              >
                {statusIcons[status]} {status}
              </div>
            </div>
            <p className='text-rich-grey'>{applicationDate}</p>
          </div>
        </div>
        {/* Cover letter */}
        <p className='mt-10 text-[20px] font-[600]'> {t('Cover letter')}</p>
        <hr className='mt-4 h-[1px] w-full border-none bg-gray-200' />
        <div className='mt-6 leading-normal'>
          <p>{coverLetter}</p>
        </div>
        <hr className='mt-6 h-[1px] w-full border-none bg-gray-200' />
        {/* Resume */}
        <div>
          <p className='mt-10 text-[20px] font-[600]'>{t('Resume')}</p>
          <div className='mt-4 space-y-2'>
            <PDFDownloader capacity='10 MB' fileName={nameCV} />
          </div>
        </div>
        {/* Button */}
        <div className='absolute bottom-4 right-8 w-full space-x-2  text-end'>
          <Button
            intent='primary'
            size='large'
            onClick={handleChangeStatus}
            disabled={status === 'Accepted' || updatingStatus}
          >
            {updatingStatus ? <IconLoader className='h-4 w-4' /> : t('Accept')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobAppliedDetails;
