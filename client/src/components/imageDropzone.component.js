import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import axios from "axios";

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

const cont = {
    backgroundColor: '#1890ff'
};

function Previews(props) {
    const [files, setFiles] = useState([]);
    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            console.log('imageDropzone.component.js :45', acceptedFiles);
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
            console.log('_________________HERE: 49________________________');
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const data = new FormData();

            acceptedFiles.map(file => {
                data.append('File[]', file);
            });
            axios.post('api/files/upload/2', data, config).then((response) => {
                console.log('_________________HERE: 54________________________');
                // this.setState({
                //     imageUrl: response.data.fileUrl
                // })
            }).catch(err => {
                console.log('Sign up error: ');
                console.log(err);
            });
        }
    });

    const thumbs = files.map(file => (
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                <img
                    src={file.preview}
                    style={img}
                />
            </div>
        </div>
    ));

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    return (
        <section className="container">
            <div {...getRootProps({className: 'dropzone'})}  style={cont}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside style={thumbsContainer}>
                {thumbs}
            </aside>
        </section>
    );
}

// import React, {Component} from 'react';
// import Dropzone from 'react-dropzone';
//
// class Basic extends Component {
//     constructor() {
//         super();
//         this.onDrop = (files) => {
//             this.setState({files})
//         };
//         this.state = {
//             files: []
//         };
//     }
//
//     render() {
//         const files = this.state.files.map(file => (
//             <li key={file.name}>
//                 {file.name} - {file.size} bytes
//             </li>
//         ));
//
//         return (
//             <Dropzone onDrop={this.onDrop}>
//                 {({getRootProps, getInputProps}) => (
//                     <section className="container">
//                         <div {...getRootProps({className: 'dropzone'})}>
//                             <input {...getInputProps()} />
//                             <p>Drag 'n' drop some files here, or click to select files</p>
//                         </div>
//                         <aside>
//                             <h4>Files</h4>
//                             <ul>{files}</ul>
//                         </aside>
//                     </section>
//                 )}
//             </Dropzone>
//         );
//     }
// }

export default Previews;


