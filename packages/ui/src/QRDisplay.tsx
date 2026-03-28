"use client";

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRDisplayProps {
  value: string;
  size?: number;
}

const QRDisplay: React.FC<QRDisplayProps> = ({ value, size = 200 }) => {
  return (
    <div className="bg-white p-2 rounded-xl inline-block">
      <QRCodeSVG value={value} size={size} />
    </div>
  );
};

export default QRDisplay;