import React from 'react';


import { Button, Select, Avatar, Badge } from "antd";
const { Option } = Select;

const CourseCreateForm = ({handleSubmit, handleImage, handleChange, values, setValues, preview, uploadButtonText, handleImageRemove}) => {

    const children = []
    for(let i = 500.00; i <= 5000.00; i = i +50){
        children.push(<Option key={i.toFixed(2)}>{i.toFixed(2)} Taka</Option>)
    }
  return (  <form onSubmit={handleSubmit}>
  <div className="form-group pb-4">
    <input
      type="text"
      name="name"
      className="form-control"
      value={values.name}
      placeHolder="Course Name"
      onChange={handleChange}
    />
  </div>
  <div className="form-group pb-4">
    <textarea
      name="description"
      onChange={handleChange}
      className="form-control"
      value={values.description}
      cols=""
      rows=""
    />
  </div>
  <div className="form-row pb-4">
    <div className="col">
     
        <Select
          onChange={(v) => setValues({ ...values, paid: !values.paid })}
          value={values.paid}
          size="large"
          style={{ width: "100%" }}
        >
          <Option value={true}>Paid</Option>
          <Option value={false}>Free</Option>
        </Select>
     
    </div>
    {values.paid && <div className='col-md-4'>
            
                <Select
                    defaultValue='500.00'
                    style={{width: '100%'}}
                    onChange={v => setValues({...values, price: v})}
                    tokenSeparators={[,]}
                    size='large'
                >
                    {children}
                </Select>
            </div>
       }
  </div>
  <div className="form-group pb-4">
    <input
      type="text"
      name="category"
      className="form-control"
      value={values.category}
      placeHolder="Category"
      onChange={handleChange}
    />
  </div>
  <div className="form-row pb-4">
    <div className="col">
      <div className="form-group">
        <label className="btn btn-outline-secondary btn-block text-left">
          {uploadButtonText}
          <input
            type="file"
            name="image"
            onChange={handleImage}
            accept="image/*"
            hidden
          />
        </label>
      </div>
    </div>
    {preview && (
      
        <Badge count="X" onClick={handleImageRemove} className='pointer'>
          <Avatar width={200} src={preview} />
        </Badge>
      
    )}
  </div>
  <div className="row">
    <div className="col">
      <Button
        type="primary"
        size="large"
        shape="round"
        loading={values.loading}
        onClick={handleSubmit}
        disabled={values.loading || values.uploading}
        className="btn btn-primary"
      >
        {values.loading ? "Saving..." : "Save & Continue"}
      </Button>
    </div>
  </div>
</form> );
};

export default CourseCreateForm;
