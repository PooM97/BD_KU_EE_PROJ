import React from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport,} from '@mui/x-data-grid';

function DataTable({width, height, data, rowCommit}) {  
    function CustomToolbar() {
        return (
            <GridToolbarContainer>
            <GridToolbarExport 
                csvOptions={{
                    fileName: "download",
                    delimiter: ',',
                    utf8WithBom: true,
                    }}
            />
            </GridToolbarContainer>
        );
        }

    return (
    <div style={{ height: height, width: width }} >
        <DataGrid
            sx={{ fontSize: '1.2rem' }}
            components={{ Toolbar: CustomToolbar }}
            rows={data.rows}
            columns={data.cols}
            autoPageSize={true}
            onCellEditCommit={rowCommit}
            disableSelectionOnClick 
        />   
    </div>
    );
}

export default DataTable