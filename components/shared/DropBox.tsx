import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import * as XLSX from 'xlsx';
import * as fs from 'file-saver';

import styled from 'styled-components';
import { useState } from 'react';
import Table, { columns, renderSubComponent } from './ShowTable';

const getColor = (props) => {
	if (props.isDragAccept) {
		return '#00e676';
	}
	if (props.isDragReject) {
		return '#ff1744';
	}
	if (props.isFocused) {
		return '#2196f3';
	}
	return '#eeeeee';
};

const Container = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40px;
	border-width: 2px;
	border-radius: 10px;
	border-color: ${(props) => getColor(props)};
	border-style: dashed;
	background-color: #fafafa;
	color: black;
	font-weight: bold;
	font-size: 1.4rem;
	outline: none;
	transition: border 0.24s ease-in-out;
`;
const FileProcessButton = styled.button`
    color: white;
    text-transform: uppercase;
    outline: none;
    background-color: #4aa1f3;
    font-weight: bold;
    padding: 8px 15px;
    margin-bottom: 5px;
`;

function DropBox({ onDrop }) {
    const [data, setResponse] = useState([]);

	const {
		getRootProps,
		getInputProps,
		acceptedFiles,
		open,
		isDragAccept,
		isFocused,
		isDragReject,
	} = useDropzone({
		accept: {
            'image/jpeg': [],
            'application/pdf': []
          },
        maxFiles: 1,
		onDrop,
		noClick: true,
		noKeyboard: true,
	});

	const lists = acceptedFiles.map((list) => (
		<li key={list.path}>
			{list.path} - {list.size} bytes
		</li>
	));

    const uploadFiles = async () => {
        console.log(acceptedFiles);
        acceptedFiles?.forEach(async (file) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = async () => {
            const base64data = reader.result.split(',')[1]; // Remove the data URL prefix
            const formData = {
              files: base64data,
            };
      
            try {
              const response = await axios.post('/api/process-invoice', formData, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              console.log(response.data.data);
              const processedData = response.data.data.entities.map((item) => {
                return {
                    key: item.type,
                    value: item.mentionText,
                    properties: item.properties.length > 0 ?  item.properties.map((prop) => ({
                        key: prop.type,
                        value: prop.mentionText
                    })) : null
                }
              })
              setResponse(processedData);
            } catch (error) {
              console.log(error);
            }
          };
        });
      };
    const downloadResult = () => {
        const xlsxData = [["KEY", "VALUE", "PROPERTIES"], ...data.map((item:any) => [item.key, item.value, JSON.stringify(item.properties)])];
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(xlsxData);

        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
        XLSX.writeFile(wb, `invoice_${Date.now()}.xlsx`);
    }
      

	return (
		<>
			{' '}
			<section className="dropbox">
                <FileProcessButton onClick={uploadFiles} disabled={acceptedFiles.length === 0}>{"Process File"}</FileProcessButton>
				<Container
					className="dropbox"
					{...getRootProps({ isDragAccept, isFocused, isDragReject })}
				>
					<input {...getInputProps()} />
					<p>Drag 'n' drop some files here</p>
					<button type="button" className="btn" onClick={open}>
						Click to select file
					</button>
				</Container>
			</section>
			<aside>
				<p>{lists}</p>
			</aside>

      <Table
        data={data}
        columns={columns}
        getRowCanExpand={() => true}
        renderSubComponent={renderSubComponent}
      />
    <br></br>
    <br></br>
    <FileProcessButton onClick={downloadResult} disabled={data.length === 0}>{"Download Result"}</FileProcessButton>

		</>
	);
}

export default DropBox;