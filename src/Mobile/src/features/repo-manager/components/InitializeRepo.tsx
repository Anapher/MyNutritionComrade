import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initialize } from '../reducer';

export default function InitializeRepo() {
   const dispatch = useDispatch();

   useEffect(() => {
      dispatch(initialize());
   }, [dispatch]);

   return null;
}
