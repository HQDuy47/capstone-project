'use client';

import { useMutation, useSuspenseQuery } from '@apollo/client';
import { Textarea } from '@mantine/core';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

import { Button } from '@/components/Button';
import { IconChevronLeft, IconEye } from '@/components/Icons';
import { InputBox } from '@/components/InputBox';
import { Radio, RadioGroup } from '@/components/Radio';
import {
  APPLY_JOBS,
  ApplyJobResponse,
  ApplyJobVariable,
  GET_JOB,
  type GetJobResponse,
  type GetJobVariable,
} from '@/graphql/job';
import { useForm } from '@/hooks/useForm';
import { cn } from '@/lib/classNames';
import { upload } from '@/lib/file';

type Form = {
  cv: string;
  coverLetter?: string;
};

const ApplyJob = () => {
  const router = useRouter();
  const params = useParams();
  const [value, setValue] = useState('default');
  const [mutate, { loading }] = useMutation<ApplyJobResponse, ApplyJobVariable>(
    APPLY_JOBS
  );

  const { fields, error, setError, onChangeField, handleSubmit } =
    useForm<Form>({
      defaultState: { cv: '', coverLetter: '' },
      config: { cv: { required: { value: true, message: 'requiredText' } } },
    });

  const {
    data: { job },
  } = useSuspenseQuery<GetJobResponse, GetJobVariable>(GET_JOB, {
    variables: {
      jobId: params.id as string,
    },
  });

  const uploadCv = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3145728) {
      setError((prev) => ({ ...prev, cv: 'maxSizeText' }));
    } else {
      const url = await upload(file);
      onChangeField('cv', url as string);
    }
  };

  const onSubmit = () => {
    mutate({
      variables: {
        job_id: job.id,
        cv: fields.cv,
        cover_letter: fields.coverLetter || '',
        user_id: 'a50efdd4-03d1-4885-bde0-8f6d337b6b20',
      },
    });
  };

  return (
    <div className='gradient-light-grey-background bg-light-grey min-h-screen w-full text-black'>
      <div className='relative mx-auto h-full max-w-[884px]'>
        <div className='relative flex py-6'>
          <Button
            onClick={() => router.back()}
            intent='transparent'
            icon={<IconChevronLeft size={20} />}
            className='px-0 !text-white'
          >
            Back
          </Button>
          <Image
            src='/images/logo.png'
            width={81}
            height={0}
            alt='logo'
            className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
          />
        </div>
        <div className='flex flex-col gap-6 rounded-lg bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,.06)]'>
          <div className='text-[22px] font-bold'>{job.name}</div>
          <InputBox
            type='text'
            name='contact_request[name]'
            label='Your name'
            required
            error='Vui lòng điền tên của bạn'
          />
          <div>
            <div className='mb-3 text-lg font-bold'>
              Your CV <span className='text-primary'>*</span>
            </div>
            <RadioGroup value={value} onChange={setValue}>
              <div
                className={cn(
                  'border-dark-grey flex gap-2 rounded border p-4',
                  { 'border-primary bg-white-red': value === 'default' }
                )}
              >
                <Radio value='default' size='large' />
                <div>
                  Use your current CV
                  <div className='text-hyperlink mt-3 flex items-center gap-2'>
                    VyDo-Resume.pdf
                    <IconEye size={20} />
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  'border-dark-grey mt-4 flex gap-2 rounded border p-4',
                  { 'border-primary bg-white-red': value === 'file' }
                )}
              >
                <Radio value='file' size='large' />
                <div>
                  Upload new CV
                  <div className='mt-3'>
                    <input
                      type='file'
                      onChange={uploadCv}
                      accept='application/doc,application/docx,application/pdf'
                    />
                  </div>
                  {error.cv && (
                    <div className='text-primary mt-1'>Can't be blank</div>
                  )}
                  <div className='text-dark-grey mt-1 text-sm'>
                    We accept .doc .docx, .pdf files, no password protected, up
                    to 3MB
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div>
            <div className='mb-3 text-lg font-bold'>
              Cover Letter{' '}
              <span className='text-dark-grey text-base font-normal'>
                (Optional)
              </span>
            </div>
            <div className='mb-3'>
              What skills, work projects or achievements make you a strong
              candidate?
            </div>
            <Textarea
              onChange={(e) => onChangeField('coverLetter', e.target.value)}
              placeholder='Details and specific examples will make your application stronger...'
              classNames={{
                input: 'text-base h-[120px]',
              }}
            />
            <div className='text-dark-grey'>
              500 of 500 characters remaining
            </div>
          </div>
          <Button
            loading={loading}
            onClick={() => handleSubmit(onSubmit)}
            className='w-full'
            size='large'
          >
            Send my CV
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;