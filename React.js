import React, { useState } from "react";
import { Form, Input, Select, Button } from "antd";

const { Option } = Select;

const DynamicForm = ({ data }) => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState(data);

  const handleFinish = (values) => {
    console.log(values);
  };

  const handleAddField = () => {
    setFormData([
      ...formData,
      { name: "", type: "string", label: "", defaultValue: "" },
    ]);
  };

  const handleDeleteField = (index) => {
    const updatedFormData = [...formData];
    updatedFormData.splice(index, 1);
    setFormData(updatedFormData);
  };

  const handleAddNestedField = (index) => {
    const updatedFormData = [...formData];
    updatedFormData[index]["fields"] = [
      { name: "", type: "string", label: "", defaultValue: "" },
    ];
    setFormData(updatedFormData);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedFormData = [...formData];
    updatedFormData[index][name] = value;
    setFormData(updatedFormData);
  };

  const handleTypeChange = (value, index) => {
    const updatedFormData = [...formData];
    updatedFormData[index]["type"] = value;
    setFormData(updatedFormData);
  };

  const renderField = (field, index) => {
    const { name, type, label, defaultValue, fields } = field;

    switch (type) {
      case "number":
        return (
          <Form.Item
            key={index}
            label={label}
            name={name}
            initialValue={defaultValue}
            rules={[
              {
                required: true,
                message: `Please input a ${label}!`,
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
        );
      case "boolean":
        return (
          <Form.Item key={index} name={name} valuePropName="checked">
            <Input type="checkbox" />
          </Form.Item>
        );
      case "object":
        return (
          <Form.Item key={index} label={label}>
            {fields.map((nestedField, nestedIndex) =>
              renderField(nestedField, nestedIndex)
            )}
            <Button onClick={() => handleAddNestedField(index)}>Add Field</Button>
          </Form.Item>
        );
      default:
        return (
          <Form.Item
            key={index}
            label={label}
            name={name}
            initialValue={defaultValue}
            rules={[
              {
                required: true,
                message: `Please input a ${label}!`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        );
    }
  };

  return (
    <Form form={form} onFinish={handleFinish}>
      {formData.map((field, index) => (
        <div key={index}>
          <Form.Item label="Name">
            <Input
              value={field.name}
              onChange={(e) => handleInputChange(e, index)}
            />
          </Form.Item>
          <Form.Item label="Type">
            <Select
              value={field.type}
              onChange={(value) => handleTypeChange(value, index)}
            >
              <Option value="string">String</Option>
              <Option value="number">Number</Option>
              <Option value="boolean">Boolean</Option>
              <Option value="object">Object</Option>
