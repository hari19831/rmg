import React, { Component, Fragment } from 'react';
import { axios } from "../config/axios/axios";
import "./dashboard.css";
import loader_img from './loader.gif';
/* eslint-disable import/first */
import configJson from "../config/axios/config.json";
const ENV_MODE = configJson.Application.mode;
const ENV_APP = configJson.Application.application;
export const CommonConstants = {
   API_URL: configJson["CommonConstants"][ENV_APP][ENV_MODE]["API_URL"],
   basePath: configJson["CommonConstants"][ENV_APP][ENV_MODE]["Base_path"],
   sharedkey: configJson["CommonConstants"][ENV_APP][ENV_MODE]["sharedkey"]
};
import { withRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';

class dashboard extends Component {
   constructor() {
      super();

      this.state = {
         productData: [],
         queueData: [],
         isDashboard: true,
         addQueueUI: false,
         isedit: false,
         queueInfo: false,
         searchInput: "",
         productKey: "",
         productNameError: false,
         isActiveError: false,
         allowcatedmbError: false,
         defaultLifeTimeError: false,
         onlyNumericAllocated: false,
         onlyNumericDefaultLife: false,
         showExchangeKey: false,
         showQuoromFields: false,
         currentProduct:{},
         values: [{
            "product_name": "",
            "is_active": true,
         }],
         queueValues: [{
            "queueName": "",
            "exchangeType": "default",
            "exchangeKey": "",
            "queueType": "classic",
            "exclusive": false,
            "durable": true,
            "autoDelete": "",
            "messageTtl": "",
            "x-expires": 0,
            "maxLength": "",
            "maxLengthBytes": "",
            "overFlow": "",
            "deatLetterExchange": "",
            "deadLetterRoutingKey": "",
            "SingleActiveConsumer": false,
            "maxPriority": "",
            "queueMode": "lazy",
            "queueMasterLocator": ""
         }]
      }
   }

   createUI() {
      return this.state.values.map((el, i) =>
         <div key={i}>
            <div>
               <label>Product Name  &nbsp;
              <span style={{ color: "red" }}>*</span></label>
               <input type="text" name="productname" maxLength="50" id="productname" defaultValue={el.product_name || ''} onChange={this.handleChange.bind(this, i)} />
               {this.state.productNameError ? <span style={{ color: "red" }}>Please enter a valid Product Name</span> : ''}
            </div>
            <div>
               <label>Is Active  &nbsp;
              <span style={{ color: "red" }}>*</span></label>
               <select name="isactive" id="isactive" defaultValue={el.is_active || ''} onChange={this.handleChange.bind(this, i)}>
                  <option value="true">True</option>
                  <option value="false">False</option>
               </select>
            </div>
         </div>
      )
   }

   createQueueUI() {
      return this.state.values.map((el, i) =>
         <div key={i}>
            <div>
               <label>Queue Name  &nbsp;
              <span style={{ color: "red" }}>*</span></label>
               <input type="text" name="queueName" id="queueName" defaultValue={el.product_name || ''} onChange={this.handleQueueChange.bind(this, i)} />
               {/* {this.state.productNameError ? <span style={{ color: "red" }}>Please Enter Prduct Name</span> : ''} */}
            </div>
            <div>
               <label>Queue Type  &nbsp;
               <span style={{ color: "red" }}>*</span></label>
               <select name="queueType" id="queueType" defaultValue='classic' onChange={this.handleQueueChange.bind(this, i)}>
                  <option value="classic">Classic</option>
                  <option value="quorum">Quorum</option>
               </select>
            </div>
            <div>
               <label>Exchange Type  &nbsp;
               <span style={{ color: "red" }}>*</span></label>
               <select name="exchangeType" id="exchangeType" defaultValue='default' onChange={this.handleQueueChange.bind(this, i)}>
                  <option value="direct">Direct</option>
                  <option value="fanout">Fanout</option>
                  <option value="topic">Topic</option>
                  <option value="default">Default</option>
                  <option value="headers">Headers</option>
               </select>
            </div>
            {
               this.state.showExchangeKey ?
                  <div>
                     <label>Exchange Key  &nbsp;
              <span style={{ color: "red" }}>*</span></label>
                     <input type="text" name="exchangeKey" id="exchangeKey" defaultValue={el.product_name || ''} onChange={this.handleQueueChange.bind(this, i)} />
                     {/* {this.state.productNameError ? <span style={{ color: "red" }}>Please Enter Prduct Name</span> : ''} */}
                  </div> : ''
            }

            {/*   <div>
               <label>Size(Bytes) &nbsp;
               <span style={{ color: "red" }}>*</span></label>
               <input type="number" name="size" id="size" defaultValue={el.product_name || ''} onChange={this.handleQueueChange.bind(this, i)} />
               {this.state.productNameError ? <span style={{ color: "red" }}>Please Enter Prduct Name</span> : ''}
            </div> */}
            {
               !this.state.showQuoromFields ?
                  <div>
                     <div>
                        <label>Exclusive  &nbsp;
               <span style={{ color: "red" }}>*</span></label>
                        <select name="exclusive" id="exclusive" defaultValue={false} onChange={this.handleQueueChange.bind(this, i)}>
                           <option value="false">False</option>
                           <option value="true">True</option>
                        </select>
                     </div>
                     <div>
                        <label>Durable  &nbsp;
               <span style={{ color: "red" }}>*</span></label>
                        <select name="durable" id="durable" defaultValue={el.is_active || ''} onChange={this.handleQueueChange.bind(this, i)}>
                           <option value="true">True</option>
                           <option value="false">False</option>
                        </select>
                     </div>
                     <div>
                        <label>Auto Delete  &nbsp;
               <span style={{ color: "red" }}>*</span></label>
                        <select name="autoDelete" id="autoDelete" onChange={this.handleQueueChange.bind(this, i)}>
                           <option style={{ display: 'none' }}></option>
                           <option value="no">No</option>
                           <option value="yes">Yes</option>
                        </select>
                     </div>
                  </div> : ''
            }
            <div>
               <label>Message TTL  &nbsp;</label>
               <input type="number" name="messageTtl" id="messageTtl" defaultValue={el.product_name || ''} onChange={this.handleQueueChange.bind(this, i)} />
               {/* {this.state.productNameError ? <span style={{ color: "red" }}>Please Enter Prduct Name</span> : ''} */}
            </div>
            <div>
               <label>Auto Expire  &nbsp;</label>
               <input type="number" name="expires" id="expires" defaultValue={el.product_name || ''} onChange={this.handleQueueChange.bind(this, i)} />
               {/* {this.state.productNameError ? <span style={{ color: "red" }}>Please Enter Prduct Name</span> : ''} */}
            </div>
            <div>
               <label>Maximum Length &nbsp;</label>
               <input type="number" name="maxLength" id="maxLength" defaultValue={el.product_name || ''} onChange={this.handleQueueChange.bind(this, i)} />
               {this.state.productNameError ? <span style={{ color: "red" }}>Please Enter Prduct Name</span> : ''}
            </div>
            <div>
               <label>Maximum Length in Bytes  &nbsp;</label>
               <input type="number" name="maxLengthBytes" id="maxLengthBytes" defaultValue={el.product_name || ''} onChange={this.handleQueueChange.bind(this, i)} />
               {this.state.productNameError ? <span style={{ color: "red" }}>Please Enter Prduct Name</span> : ''}
            </div>
            <div>
               <label>Overflow Behaviour  &nbsp;</label>
               <select name="overFlow" id="overFlow" defaultValue='drop-head' onChange={this.handleQueueChange.bind(this, i)}>
                  <option value="drop-head">Drop-Head</option>
                  <option value="reject-publish">Reject-Publish</option>
               </select>
            </div>
            <div>
               <label>Dead Letter Exchange  &nbsp;</label>
               <input type="text" name="deatLetterExchange" id="deatLetterExchange" defaultValue={el.product_name || ''} onChange={this.handleQueueChange.bind(this, i)} />
               {this.state.productNameError ? <span style={{ color: "red" }}>Please Enter Prduct Name</span> : ''}
            </div>
            <div>
               <label>Dead Letter Routing Key  &nbsp;</label>
               <input type="text" name="deadLetterRoutingKey" id="deadLetterRoutingKey" defaultValue={el.product_name || ''} onChange={this.handleQueueChange.bind(this, i)} />
               {this.state.productNameError ? <span style={{ color: "red" }}>Please Enter Prduct Name</span> : ''}
            </div>
            <div>
               <label>Single Active Consumer  &nbsp;</label>
               <select name="SingleActiveConsumer" id="SingleActiveConsumer" defaultValue='false' onChange={this.handleQueueChange.bind(this, i)}>
                  <option value="true">True</option>
                  <option value="false">False</option>
               </select>
            </div>
            <div>
               <label>Maximum Prority  &nbsp;</label>
               <input type="number" name="maxPriority" id="maxPriority" defaultValue={el.product_name || ''} onChange={this.handleQueueChange.bind(this, i)} />
               {this.state.productNameError ? <span style={{ color: "red" }}>Please Enter Prduct Name</span> : ''}
            </div>
            <div>
               <label>Lazy mode &nbsp;</label>
               <input type="text" name="queueMode" id="queueMode" defaultValue="Lazy" onChange={this.handleQueueChange.bind(this, i)} />
               {this.state.productNameError ? <span style={{ color: "red" }}>Please Enter Prduct Name</span> : ''}
            </div>
            {/*  <div>
               <label>Master Locator &nbsp;</label>
               <input type="text" name="queueMasterLocator" id="queueMasterLocator" defaultValue={el.product_name || ''} onChange={this.handleQueueChange.bind(this, i)} />
               {this.state.productNameError ? <span style={{ color: "red" }}>Please Enter Prduct Name</span> : ''}
            </div> */}
            {/* <input type='button' value='Remove' onClick={this.removeClick.bind(this, i)} /> */}
         </div>
      )
   }

   addClick = () => {
      this.setState(prevState => ({ values: [...prevState.values, { product_name: '', is_active: '' }] }))
   }

   queueInfoClick = (value, i) => {
      this.LoaderStart();
      this.setState({ queueInfo: !this.state.queueInfo, currentProduct: value })
      if (value != "") {
         axios.get(`${CommonConstants.API_URL}/getAllQueue`, { headers: { apikey: value.apikey } })
            .then(response => {
               this.LoaderStop();
               this.setState({ product: value, queueData: response.data.data, productKey: value.apikey });
            })
            .catch(error => {
               this.LoaderStop();
               if (error.response && error.response.data && error.response.data.message) {
                  toast.error(`Problem with ${error.response.data.message}`);
               }
            });
      } else {
         this.props.history.push("/");
      }
   }

   /** do not delete this method */
   // removeClick =(i)=> {
   //    let values = [...this.state.values];
   //    values.splice(i, 1);
   //    this.setState({ values });
   // }

   handleChange = (i, event) => {
      const checkNum = /^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/;
      const specialCharCheck = /[^a-zA-Z0-9\-\/]/
      let values = [...this.state.values];

      if (event.target.name == "productname") {
         if (event.currentTarget.value === '' || event.currentTarget.value === null) {
            this.setState({
               productNameError: true
            })
         } else if (specialCharCheck.test(event.currentTarget.value)) {
            this.setState({ productNameError: true })
         }
         else {
            this.setState({
               productNameError: false
            })
            values[i].product_name = event.currentTarget.value;
         }

      }

      if (event.target.name == "isactive") {
         if (event.currentTarget.value === '' || event.currentTarget.value === null) {
            this.setState({
               isActiveError: true
            })
         } else {
            this.setState({
               isActiveError: false
            })
            values[i].is_active = event.currentTarget.value;
         }

      }
      this.setState({ values });
   }

   handleQueueChange = (i, event) => {
      const checkNum = /^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/;
      let queueValues = [...this.state.queueValues];

      if (event.target.name == "queueName") {
         queueValues[i].queueName = event.currentTarget.value;
      }

      if (event.target.name == "queueType") {
         if (event.currentTarget.value === '' || event.currentTarget.value === null) {
            this.setState({
               isActiveError: true
            })
         } else if (event.currentTarget.value === 'quorum') {
            this.setState({
               showQuoromFields: true
            })
         } else if (event.currentTarget.value === 'classic') {
            this.setState({
               showQuoromFields: false
            })
         }
         else {
            this.setState({
               isActiveError: false
            })
            queueValues[i].queueType = event.currentTarget.value;
         }

      }

      if (event.target.name == "exchangeType") {
         if (event.currentTarget.value === '' || event.currentTarget.value === null) {
            this.setState({
               defaultLifeTimeError: true,
               onlyNumericDefaultLife: false
            })
         } else if (event.currentTarget.value === 'direct' || event.currentTarget.value === 'topic' || event.currentTarget.value === 'headers') {
            this.setState({ showExchangeKey: true })
            queueValues[i].exchangeType = event.currentTarget.value;
         }
         else if (event.currentTarget.value === 'default' || event.currentTarget.value === 'fanout') {
            this.setState({ showExchangeKey: false })
            queueValues[i].exchangeType = event.currentTarget.value;
         }
         else {
            this.setState({
               defaultLifeTimeError: false,
               onlyNumericDefaultLife: true
            })
            queueValues[i].exchangeType = event.currentTarget.value;
         }

         if (checkNum.test(event.currentTarget.value)) {
            this.setState({
               onlyNumericDefaultLife: false
            })
         }
      }

      if (event.target.name == "exchangeKey") {
         if (event.currentTarget.value === '' || event.currentTarget.value === null) {
            this.setState({
               allowcatedmbError: true,
               onlyNumericAllocated: false
            })
         } else {
            this.setState({
               allowcatedmbError: false,
               onlyNumericAllocated: true
            })
            queueValues[i].exchangeKey = event.currentTarget.value;
         }
      }
      if (event.target.name == "autoDelete") {
         if (event.currentTarget.value === '' || event.currentTarget.value === null) {
            this.setState({
               isActiveError: true
            })
         } else {
            this.setState({
               isActiveError: false
            })
            queueValues[i].autoDelete = event.currentTarget.value;
         }

      }
      if (event.target.name == "exclusive") {
         queueValues[i].exclusive = event.currentTarget.value;
      }
      if (event.target.name == "durable") {
         queueValues[i].durable = event.currentTarget.value;
      }
      if (event.target.name == "messageTtl") {
         queueValues[i].messageTtl = event.currentTarget.value;
      }
      if (event.target.name == "expires") {
         queueValues[i].expires = event.currentTarget.value;
      }
      if (event.target.name == "maxLength") {
         queueValues[i].maxLength = event.currentTarget.value;
      }
      if (event.target.name == "maxLengthBytes") {
         queueValues[i].maxLengthBytes = event.currentTarget.value;
      }
      if (event.target.name == "overFlow") {
         queueValues[i].overFlow = event.currentTarget.value;
      }
      if (event.target.name == "deatLetterExchange") {
         queueValues[i].deatLetterExchange = event.currentTarget.value;
      }
      if (event.target.name == "deadLetterRoutingKey") {
         queueValues[i].deadLetterRoutingKey = event.currentTarget.value;
      }
      if (event.target.name == "SingleActiveConsumer") {
         queueValues[i].SingleActiveConsumer = event.currentTarget.value;
      }
      if (event.target.name == "maxPriority") {
         queueValues[i].maxPriority = event.currentTarget.value;
      }
      if (event.target.name == "queueMode") {
         queueValues[i].queueMode = event.currentTarget.value;
      }
      if (event.target.name == "queueMasterLocator") {
         queueValues[i].queueMasterLocator = event.currentTarget.value;
      }

      this.setState({ queueValues });
   }

   handleSubmit = (event) => {
      this.LoaderStart();
      //event.preventDefault();
      let product = {}
      this.state.values.forEach(value => {
         product = {
            "product_name": value.product_name,
            "version": value.version,
            "default_life_time": value.default_life_time,
            "product_key": value.product_key,
            "is_active": value.is_active,
            "allocated_mb": value.allocated_mb
         }
      })
      if (!this.state.productNameError) {
         axios.post(`${CommonConstants.API_URL}/createProduct`, product, { headers: { apikey: localStorage.getItem('sharedkey') } }).then(response => {
            toast('Product created/update successfully');
            if (response.data.data) {
               this.setState({ isedit: false, isDashboard: true });

               axios.get(`${CommonConstants.API_URL}/getAllProduct`, { headers: { apikey: localStorage.getItem('sharedkey') } })
                  .then(response => {
                     this.LoaderStop();
                     debugger
                     this.setState({ productData: response.data.data });
                     //this.componentDidMount();
                  })
                  .catch(error => {
                     this.LoaderStop();
                     console.error('error', error);
                  });
            }
         }).catch(error => {
            this.LoaderStop();
            if (error.response && error.response.data && error.response.data.message) {
               toast.error(`${error.response.data.message}`);
            }
         });
      }
   }
   handleQueueSubmit = (event) => {

      event.preventDefault();
      let queue = {}
      this.state.queueValues.forEach(value => {
         queue = {
            "queueName": value.queueName,
            "exchangeType": value.exchangeType,
            "exchangeKey": value.exchangeKey,
            "queueType": value.queueType,
            "exclusive": value.exclusive,
            "durable": value.durable,
            "autoDelete": value.autoDelete,
            "messageTtl": value.messageTtl,
            "x-expires": value.expires,
            "maxLength": value.maxLength,
            "maxLengthBytes": value.maxLengthBytes,
            "overFlow": value.overFlow,
            "deatLetterExchange": value.deatLetterExchange,
            "deadLetterRoutingKey": value.deadLetterRoutingKey,
            "SingleActiveConsumer": value.SingleActiveConsumer,
            "maxPriority": value.maxPriority,
            "queueMode": value.queueMode,
            "queueMasterLocator": value.queueMasterLocator
         }
      })
      this.LoaderStart();
      axios.post(`${CommonConstants.API_URL}/createQueue`, queue, { headers: { apikey: this.state.productKey } }).then(response => {
         toast('Product created/update successfully');
         if (response.data.data) {
            // if (response.data.data.apikey != undefined) {
            //    Swal.fire({
            //       title: `API KEY(Copy)`,
            //       html: `<div>
            //       <p>${response.data.data.apikey}</p>
            //       </div>`,
            //       type: 'success',
            //       width: 1000,
            //       timer: 10000,
            //       showConfirmButton: false
            //    })
            // }
            this.setState({ isedit: false, isDashboard: false, queueInfo: true });

            this.getAllQueue();
         }
      }).catch(error => {
         this.LoaderStop();
         if (error.response && error.response.data && error.response.data.message) {
            toast.error(`Problem with ${error.response.data.message}`);
         }
      });
   }

   componentDidMount = () => {
      this.LoaderStart();
      if (localStorage.getItem('sharedkey')) {
         axios.get(`${CommonConstants.API_URL}/getAllProduct`, { headers: { apikey: localStorage.getItem("sharedkey") } })
            .then(response => {
               this.LoaderStop();
               this.setState({ productData: response.data.data });
               setTimeout(() => {
                  console.log("pd", this.state.productData);
               }, 500);
            })
            .catch(error => {
               if (error.response && error.response.data && error.response.data.message) {
                  toast.error(`Problem with ${error.response.data.message}`);
               }
            });
      } else {
         this.props.history.push("/");
      }
   }
   getAllQueue = () => {
      this.LoaderStart();
      axios.get(`${CommonConstants.API_URL}/getAllQueue`, { headers: { apikey: this.state.productKey } })
         .then(response => {
            this.LoaderStop();
            this.setState({ queueData: response.data.data });
         })
         .catch(error => {
            this.LoaderStop();
            if (error.response && error.response.data && error.response.data.message) {
               toast.error(`Problem with ${error.response.data.message}`);
            }
         });
   }
   editRow = (value, i) => {
      this.state.values.forEach(product => {
         product.product_name = value.product_name;
         product.version = value.version;
         product.default_life_time = value.default_life_time;
         product.product_key = value.product_key;
         product.is_active = value.is_active;
         product.allocated_mb = value.allocated_mb
      });
      this.setState({ isedit: true, isDashboard: false });
   }
   activeDeactive = (values, i) => {
      var product = {
         "product_name": values.product_name,
         "version": values.version,
         "default_life_time": values.default_life_time,
         "product_key": values.product_key,
         "is_active": values.is_active,
         "allocated_mb": values.allocated_mb
      }
      let url = values.is_active == true ? '/deactiveProduct' : '/activeProduct';
      axios.post(`${CommonConstants.API_URL}${url}`, product, { headers: { apikey: values.apikey } })
         .then(response => {

            if (response.data && response.data.data) {
               if (response.data.data == "Product is activated") {
                  Swal.fire({
                     title: 'Product Activated',
                     allowEscapeKey: false,
                     allowOutsideClick: false,
                     timer: 2000,
                     didOpen: () => {
                        Swal.showLoading();
                     }
                  }).then((result) => {
                     if (result.dismiss === 'timer') {
                        Swal.fire({
                           title: 'Finished!',
                           type: 'success',
                           timer: 2000,
                           showConfirmButton: false
                        })
                     }
                  }
                  );
               } else {
                  Swal.fire({
                     title: 'Product De-Activated',
                     allowEscapeKey: false,
                     allowOutsideClick: false,
                     timer: 2000,
                     didOpen: () => {
                        Swal.showLoading();
                     }
                  }).then((result) => {
                     if (result.dismiss === 'timer') {
                        Swal.fire({
                           title: 'Finished!',
                           type: 'success',
                           timer: 2000,
                           showConfirmButton: false
                        })
                     }
                  }
                  );
               }
               this.componentDidMount();
            }

         })
         .catch(error => {
            console.error('error', error);
            if (error.response && error.response.data && error.response.data.message) {
               toast.error(`Problem ${error.response.data.message}`);
            }
         });
   }
   add = () => {
      this.setState({
         isDashboard: false,
         values: [{
            "product_name": "",
            "version": 0,
            "default_life_time": 0,
            "product_key": 0,
            "is_active": true,
            "allocated_mb": 0
         }]
      })
   }

   addQueue = () => {
      this.setState({ addQueueUI: !this.state.addQueueUI })
   }

   logout = () => {
      toast('logged out successfully');
      localStorage.removeItem("sharedkey")
      this.props.history.push("/");
   }
   globalSearch = (event) => {
      let { productData } = this.state;
      let filteredData = productData.filter(value => {
         return (
            value.product_name.toLowerCase().includes(event.target.value.toLowerCase())
         );
      });
      this.setState({ productData: filteredData });
      if (event.target.value == "") {
         window.location.reload();
      }
   };
   globalQueueSearch = (event) => {
      let { queueData } = this.state;
      let filteredData = queueData.filter(value => {
         return (
            value.queueName.toLowerCase().includes(event.target.value.toLowerCase())
         );
      });
      this.setState({ queueData: filteredData });
      if (event.target.value == "") {
         window.location.reload();
      }
   };
   searchHandle = (e) => {
      this.setState({ searchInput: e.target.value })
   }
   backToDashboard = () => {
      this.setState({ isedit: false, isDashboard: true, queueInfo: false, addQueueUI: false })
   }
   deleteRow = (value, i) => {
      let { inputValue } = this.state;
      let deleteProduct = {
         product_name: value.product_name
      }
      Swal.fire({
         input: 'text',
         inputLabel: 'Confirm Product Name',
         inputValue: inputValue,
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Yes, delete it!',
         cancelButtonText: 'No, keep it'
      }).then((result) => {
         if (result.value == value.product_name) {
            axios.post(`${CommonConstants.API_URL}/deleteProduct`, deleteProduct, { headers: { apikey: localStorage.getItem("sharedkey") } })
               .then(response => {
                  if (response.data.is_success) {
                     Swal.fire(
                        'Deleted!',
                        'Seleted product has been deleted.',
                        'success'
                     )
                     this.componentDidMount();
                  }
               })
               .catch(error => {
                  console.error('error', error);
                  if (error.response && error.response.data && error.response.data.message) {
                     toast.error(`Problem ${error.response.data.message}`);
                  }
               });

         } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
               'Cancelled',
               'Your product is safe :)',
               'error'
            )
         } else {
            Swal.fire({
               input: 'text',
               inputLabel: 'Conform Product Name',
               inputValue: inputValue,
               icon: 'warning',
               showCancelButton: true,
               confirmButtonText: 'Yes, delete it!',
               cancelButtonText: 'No, keep it'
            }).then((results) => {
               if (results.value == value.product_name) {
                  axios.post(`${CommonConstants.API_URL}/deleteProduct`, deleteProduct, { headers: { apikey: localStorage.getItem("sharedkey") } })
                     .then(response => {
                        if (response.data.is_success) {
                           Swal.fire(
                              'Deleted!',
                              'Seleted product has been deleted.',
                              'success'
                           )
                           this.componentDidMount();
                        }

                     })
                     .catch(error => {
                        console.error('error', error);
                        if (error.response && error.response.data && error.response.data.message) {
                           toast.error(`Problem ${error.response.data.message}`);
                        }
                     });

               } else if (result.dismiss === Swal.DismissReason.cancel) {
                  Swal.fire(
                     'Cancelled',
                     'Your product is safe :)',
                     'error'
                  )
               } else {
                  Swal.fire(
                     'Cancelled',
                     'Please Enter Correct Product Name!:)',
                     'error'
                  )
               }

            })
         }
      });

   }
   deleteQueueRow = (value, i) => {
      console.log("value", value);
      let { inputValue } = this.state;
      let deleteQueue = {
         queueName: value.queueName
      }
      Swal.fire({
         input: 'text',
         inputLabel: 'Confirm Queue Name',
         inputValue: inputValue,
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Yes, delete it!',
         cancelButtonText: 'No, keep it'
      }).then((result) => {
         if (result.value == value.queueName) {
            axios.post(`${CommonConstants.API_URL}/deleteQueue`, deleteQueue, { headers: { apikey: this.state.productKey } })
               .then(response => {
                  if (response.data.is_success) {
                     Swal.fire(
                        'Deleted!',
                        'Seleted product has been deleted.',
                        'success'
                     )
                     this.getAllQueue();
                  }
               })
               .catch(error => {
                  console.error('error', error);
                  if (error.response && error.response.data && error.response.data.message) {
                     toast.error(`Problem ${error.response.data.message}`);
                  }
               });

         } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
               'Cancelled',
               'Your product is safe :)',
               'error'
            )
         } else {
            Swal.fire({
               input: 'text',
               inputLabel: 'Conform Product Name',
               inputValue: inputValue,
               icon: 'warning',
               showCancelButton: true,
               confirmButtonText: 'Yes, delete it!',
               cancelButtonText: 'No, keep it'
            }).then((results) => {
               if (results.value == value.queueName) {
                  axios.post(`${CommonConstants.API_URL}/deleteQueue`, deleteQueue, { headers: { apikey: value.apikey } })
                     .then(response => {
                        if (response.data.is_success) {
                           Swal.fire(
                              'Deleted!',
                              'Seleted product has been deleted.',
                              'success'
                           )
                           this.componentDidMount();
                        }

                     })
                     .catch(error => {
                        console.error('error', error);
                        if (error.response && error.response.data && error.response.data.message) {
                           toast.error(`Problem ${error.response.data.message}`);
                        }
                     });

               } else if (result.dismiss === Swal.DismissReason.cancel) {
                  Swal.fire(
                     'Cancelled',
                     'Your product is safe :)',
                     'error'
                  )
               } else {
                  Swal.fire(
                     'Cancelled',
                     'Please Enter Correct Product Name!:)',
                     'error'
                  )
               }

            })
         }
      });

   }

   clearQueueRow = (value, i) => {
      console.log("value", value);
      let { inputValue } = this.state;
      let clearQueue = {
         queueName: value.queueName
      }
      Swal.fire({
         input: 'text',
         inputLabel: 'Confirm Queue Name',
         inputValue: inputValue,
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Yes, clear it!',
         cancelButtonText: 'No, keep it'
      }).then((result) => {
         if (result.value == value.queueName) {
            axios.post(`${CommonConstants.API_URL}/clearQueueMessage`, clearQueue, { headers: { apikey: this.state.productKey } })
               .then(response => {
                  if (response.data.is_success) {
                     Swal.fire(
                        'Cleared!',
                        'Seleted queue has been cleared.',
                        'success'
                     )
                     this.getAllQueue();
                  }
               })
               .catch(error => {
                  console.error('error', error);
                  if (error.response && error.response.data && error.response.data.message) {
                     toast.error(`Problem ${error.response.data.message}`);
                  }
               });

         } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
               'Cancelled',
               'Your product is safe :)',
               'error'
            )
         } else {
            Swal.fire({
               input: 'text',
               inputLabel: 'Conform Product Name',
               inputValue: inputValue,
               icon: 'warning',
               showCancelButton: true,
               confirmButtonText: 'Yes, delete it!',
               cancelButtonText: 'No, keep it'
            }).then((results) => {
               if (results.value == value.queueName) {
                  axios.post(`${CommonConstants.API_URL}/clearQueueMessage`, clearQueue, { headers: { apikey: value.apikey } })
                     .then(response => {
                        if (response.data.is_success) {
                           Swal.fire(
                              'Deleted!',
                              'Seleted product has been deleted.',
                              'success'
                           )
                           this.componentDidMount();
                        }

                     })
                     .catch(error => {
                        console.error('error', error);
                        if (error.response && error.response.data && error.response.data.message) {
                           toast.error(`Problem ${error.response.data.message}`);
                        }
                     });

               } else if (result.dismiss === Swal.DismissReason.cancel) {
                  Swal.fire(
                     'Cancelled',
                     'Your product is safe :)',
                     'error'
                  )
               } else {
                  Swal.fire(
                     'Cancelled',
                     'Please Enter Correct Product Name!:)',
                     'error'
                  )
               }

            })
         }
      });

   }

   copyApi = (value, i) => {
      if (value.apikey) {
         navigator.clipboard.writeText(value.apikey);
         Swal.fire(
            'Copied!',
            'Selected apikey is copied',
            'success'
         )
      } else {
         Swal.fire(
            'Error',
            'Error while coping file!',
            'error'
         )
      }
   }

   LoaderStart = () => {
      document.getElementById('pe-page-loader').classList.add('active');
   }
   LoaderStop = () => {
      document.getElementById('pe-page-loader').classList.remove('active');
   }

   render() {
      return (
         <div id="dashboadPage">
            <div id="pe-page-loader">
               <img src={loader_img} alt="Loading" />
            </div>
            <div id="top" className="space-between">
               <div className="head-txt">Message Queue - Rabbit MQ</div>
               <div className="logout-stl" onClick={this.logout}>Logout</div>
            </div>
            <br /><br />
            {!this.state.isDashboard ?
               <form onSubmit={this.handleSubmit}>
                  {this.createUI()}
                  {this.state.isedit ?
                     <div>
                        {/*  <button>Update Product</button> */}
                        <input type="button" className='btn-stl' value="Update Product" onClick={this.handleSubmit.bind(this, "update")} />
                        <input type="button" className='btn-stl' value="Back" onClick={this.backToDashboard.bind(this)} />&nbsp;
                   </div>
                     :
                     <div>
                        {/* <button tabIndex="1">Create Product</button> */}
                        <input type="button" className='btn-stl' value="Create Product" onClick={this.handleSubmit.bind(this, "create")} />
                        <input type="button" className='btn-stl' value="Back" onClick={this.backToDashboard.bind(this)} />&nbsp;
                   </div>

                  }
               </form>
               :
               this.state.addQueueUI ?
                  <form onSubmit={this.handleQueueSubmit}>
                     {this.createQueueUI()}
                     <div>
                        <input type="button" className='btn-stl' value="Back" onClick={this.backToDashboard.bind(this)} />&nbsp;
                        <button>Create Queue</button>
                     </div>
                  </form>
                  :
                  this.state.queueInfo ?
                     <div>
                        <div>
                           <button onClick={this.addQueue}>Add Queue</button>
                        </div>
                        <div>
                           <div className="space-between">
                              <div>
                              </div>
                              <div>
                                 <input type="search" defaultValue={this.state.searchInput} id="tableSearch" name="tableSearch" onChange={this.globalQueueSearch} placeholder="Search by queue name" />
                              </div>
                           </div>
                           {this.state.queueData.length > 0 ?
                              <div>
                                 <table id="editableTable">
                                    <thead>
                                       <tr>
                                          <th>Queue Name</th>
                                          <th>Queue Type</th>
                                          <th>Exchange Type</th>
                                          <th>Available Messages</th>
                                          {/* <th>Size Occupied</th>
                                          <th>Available space</th> */}
                                          <th>Action</th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       {this.state.queueData.map((value, i) => {
                                          return (
                                             <Fragment>
                                                <tr key={i}>
                                                   <td >{value.queueName}</td>
                                                   <td >{value.options.queueType}</td>
                                                   <td >{value.exchange.exchangeType}</td>
                                                   <td>{value.messageCount}</td>
                                                   {/* <td >100
                                                   </td>
                                                   <td>200</td> */}
                                                   <td className="td-align">
                                                      <div className="btn-stl-clear" onClick={() => this.clearQueueRow(value, i)}>Clear</div>
                                                      <div className="btn-stl-deactivate" onClick={() => this.deleteQueueRow(value, i)}>Delete</div>
                                                   </td>
                                                </tr>
                                             </Fragment>);
                                       })}
                                    </tbody>
                                 </table>

                                 <div>
                                    <input type="button" className='btn-stl' value="Back" onClick={this.backToDashboard.bind(this)} />&nbsp;
                                 </div>
                              </div>
                              :
                              <div>
                                 {/* <div className="center">No Data found</div> */}
                                 <div>
                                    <input type="button" className='btn-stl' value="Back" onClick={this.backToDashboard.bind(this)} />&nbsp;
                                 </div>
                              </div>
                           }
                        </div>
                     </div>
                     :
                     <div>
                        <div>
                           <button onClick={this.add}>Add Product</button>
                        </div>

                        <div>
                           <div className="space-between">
                              <div>
                              </div>
                              <div>
                                 <input type="search" defaultValue={this.state.searchInput} id="tableSearch" name="tableSearch" onChange={this.globalSearch} placeholder="Search by product name" />
                              </div>
                           </div>
                           {this.state.productData.length > 0 ?
                              <div>
                                 <table id="editableTable">
                                    <thead>
                                       <tr>
                                          <th>Product Name</th>
                                          <th>No. of Queues</th>
                                          <th>Action</th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       {this.state.productData.map((value, i) => {
                                          return (
                                             <Fragment>
                                                <tr key={i}>
                                                   <td >{value.product_name}</td>
                                                   <td >{value.queue_details.length}</td>
                                                   <td className="td-align">
                                                      {value.is_active ? <div className="btn-stl-info" onClick={() => this.queueInfoClick(value, i)}>Queue Info</div> : <div className="btn-stl-disabled">Queue Info</div>}
                                                      <div className="btn-stl-deactivate" onClick={() => this.deleteRow(value, i)}>Delete</div>
                                                      {value.is_active ? <div className="btn-stl-deactivate" onClick={() => this.activeDeactive(value, i)}>De-Activate</div> : <div className="btn-stl-edit" onClick={() => this.activeDeactive(value, i)}>Activate</div>}
                                                      <div className="btn-stl-edit" onClick={() => this.copyApi(value, i)}>Copy APIKEY</div>
                                                   </td>
                                                </tr>
                                             </Fragment>);
                                       })}
                                    </tbody>
                                 </table>
                              </div>
                              :
                              <div className="center">No Data found</div>
                           }
                        </div>

                     </div>}
            <ToastContainer position="top-right" />
         </div>
      );
   }
}

export default withRouter(dashboard);