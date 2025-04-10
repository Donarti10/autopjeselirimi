import React, { useState } from "react";
import { Drawer, Input, Button, Form, Space, TimePicker } from "antd";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const AddTransportDetail = ({
  visible,
  onClose,
  transportRelationId,
  refreshTransport,
}) => {
  const url = process.env.REACT_APP_API_URL;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    // Combine startTime and endTime into a single time string
    const timeString = `${values.startTime?.format(
      "HH:mm"
    )} - ${values.endTime?.format("HH:mm")}`;
    const postData = {
      id: 0,
      transportRelationID: transportRelationId,
      time: timeString,
      company: values.company,
    };

    try {
      const response = await fetch(`${url}/TransportRelationDetail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      toast.success("Transport detail added successfully!");
      form.resetFields();
      onClose();
      if (refreshTransport) refreshTransport();
    } catch (error) {
      toast.error("Failed to add transport detail.");
      console.error("Error adding transport detail:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title="Shto Detaj Transporti"
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Koha e Nisjes"
          name="startTime"
          rules={[{ required: true, message: "Vendos kohën e nisjes!" }]}
        >
          <TimePicker
            format="HH:mm"
            style={{ width: "100%" }}
            placeholder="Zgjidh kohën e nisjes"
          />
        </Form.Item>
        <Form.Item
          label="Koha e Mbarimit"
          name="endTime"
          rules={[{ required: true, message: "Vendos kohën e mbarimit!" }]}
        >
          <TimePicker
            format="HH:mm"
            style={{ width: "100%" }}
            placeholder="Zgjidh kohën e mbarimit"
          />
        </Form.Item>
        <Form.Item
          label="Kompania"
          name="company"
          rules={[{ required: true, message: "Vendos kompaninë!" }]}
        >
          <Input placeholder="Shëno emrin e kompanisë" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Shto Detaj
            </Button>
            <Button onClick={onClose}>Anulo</Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddTransportDetail;
