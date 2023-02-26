import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';
import LinkPanel from '../components/LinkPanel';

export default function index() {
  useEffect(() => {});
  return (
    <div>
      <h1 className="font-mono">Design Panel</h1>
      <LinkPanel></LinkPanel>
    </div>
  );
}
