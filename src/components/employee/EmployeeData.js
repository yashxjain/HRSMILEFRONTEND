import React from 'react';
import { useParams } from 'react-router-dom';
const EmployeeData = ( ) => {
    const { EmpId } = useParams();
    return (
        <><h1>
            {EmpId}</h1></>
    );
};

export default EmployeeData;
