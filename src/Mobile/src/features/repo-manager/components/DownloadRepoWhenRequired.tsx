import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { downloadRepositoryUpdates } from '../reducer';
import { selectInitializationResultStatus } from '../selectors';

const UPDATE_INTERVAL = 1000 * 60 * 60 * 1; // 1 hour

export default function DownloadRepoWhenRequired() {
   const dispatch = useDispatch();
   const status = useSelector(selectInitializationResultStatus);

   useEffect(() => {
      if (status === 'not-initialized') return;

      const handleDownload = () => dispatch(downloadRepositoryUpdates());
      handleDownload();

      const handle = setInterval(handleDownload, UPDATE_INTERVAL);

      return () => {
         clearInterval(handle);
      };
   }, [status]);

   return null;
}
