'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Box, Typography, useTheme } from '@mui/material';

// A custom debounce hook for filtering
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const DataTable = ({ data, config }) => {
    const theme = useTheme();
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState([]);
    const [rowSelection, setRowSelection] = useState({});

    // Apply debouncing to the global filter
    const debouncedGlobalFilter = useDebounce(globalFilter, 500);

    // Enhanced columns with client-side rendering functions
    const columns = useMemo(() => {
        return config.columns.map(column => {
            // Add cell renderer for Name column with image
            if (column.accessorKey === 'name') {
                return {
                    ...column,
                    Cell: ({ renderedCellValue, row }) => (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                                alt="avatar"
                                src={row.original.imageUrl}
                                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                            />
                            <span>{renderedCellValue}</span>
                        </div>
                    ),
                };
            }

            // Add cell renderer for Status column
            if (column.accessorKey === 'status') {
                return {
                    ...column,
                    Cell: ({ renderedCellValue }) => (
                        <div
                            style={{
                                backgroundColor: renderedCellValue === 'Active' ? '#e6f7e6' : '#ffebee',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                color: renderedCellValue === 'Active' ? '#388e3c' : '#d32f2f',
                                fontWeight: 'bold',
                                display: 'inline-block',
                            }}
                        >
                            {renderedCellValue}
                        </div>
                    ),
                };
            }

            return column;
        });
    }, [config.columns]);

    // Configure table
    const table = useMaterialReactTable({
        columns,
        data,
        enableRowSelection: config.options?.enableRowSelection ?? true,
        enableColumnFilters: config.options?.enableColumnFilters ?? true,
        enableGlobalFilter: config.options?.enableGlobalFilter ?? true,
        enablePagination: config.options?.enablePagination ?? true,
        enableColumnResizing: config.options?.enableColumnResizing ?? true,
        enableColumnOrdering: config.options?.enableColumnOrdering ?? true,
        enableStickyHeader: config.options?.enableStickyHeader ?? true,
        muiTableContainerProps: config.options?.muiTableContainerProps ?? { sx: { maxHeight: '500px' } },
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        state: {
            globalFilter: debouncedGlobalFilter,
            columnFilters,
            rowSelection,
        },
        initialState: {
            sorting: [
                {
                    id: 'age',
                    desc: false,
                },
            ],
            showColumnFilters: true,
        },
        positionGlobalFilter: 'left',
        muiSearchTextFieldProps: {
            placeholder: 'Search by name...',
            sx: { minWidth: '300px' },
            variant: 'outlined',
            size: 'small',
        },
        positionToolbarAlertBanner: 'bottom',
        renderTopToolbarCustomActions: ({ table }) => (
            <Box sx={{ display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap' }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    People Management
                </Typography>
                {Object.keys(rowSelection).length > 0 && (
                    <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                        {Object.keys(rowSelection).length} row(s) selected
                    </Typography>
                )}
            </Box>
        ),
    });

    return <MaterialReactTable table={table} />;
};

export default DataTable; 