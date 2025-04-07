import React, { useState, useEffect } from "react";
import { Drawer, Input, Button, Form, Select } from "antd";
import toast from "react-hot-toast";

const AddCommunication = ({ visible, onClose, refreshUsers }) => {
  const [form] = Form.useForm();
  const url = process.env.REACT_APP_API_URL;

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [commTypes, setCommTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await fetch(`${url}/User`);
        if (!res.ok) throw new Error(res.status);
        setUsers(await res.json());
      } catch {
        toast.error("Failed to load users");
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchTypes = async () => {
      setLoadingTypes(true);
      try {
        const res = await fetch(`${url}/ComunicationType`);
        if (!res.ok) throw new Error(res.status);
        setCommTypes(await res.json());
      } catch {
        toast.error("Failed to load communication types");
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchUsers();
    fetchTypes();
  }, [url]);

  const selectedTypeID = Form.useWatch("comunicationTypeID", form);

  const handleValuesChange = (changed) => {
    if ("comunicationTypeID" in changed) {
      const t = changed.comunicationTypeID;
      if (t === 1) {
        form.setFieldsValue({ username: undefined, password: undefined });
      } else if (t === 3 || t === 5) {
        form.setFieldsValue({ password: undefined });
      }
    }
  };

  const onFinish = async (values) => {
    const postData = {
      id: 0,
      localUserID: values.localUserID,
      comunicationTypeID: values.comunicationTypeID,
      value: values.value,
      username: values.comunicationTypeID === 1 ? null : values.username,
      password: [1, 3, 5].includes(values.comunicationTypeID)
        ? null
        : values.password,
    };

    try {
      const res = await fetch(`${url}/LocalUserSettingCommunication`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      if (!res.ok) throw new Error(res.status);
      toast.success("Communication saved!");
      form.resetFields();
      onClose?.();
      refreshUsers?.();
    } catch {
      toast.error("Failed to save communication");
    }
  };

  return (
    <Drawer
      title="Shto Komunikim"
      placement="right"
      onClose={onClose}
      open={visible}
      width={600}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        onValuesChange={handleValuesChange}
      >
        <Form.Item
          label="Përdoruesi"
          name="localUserID"
          rules={[{ required: true, message: "Zgjidh një përdorues!" }]}
        >
          <Select
            placeholder="Zgjidh përdoruesin"
            loading={loadingUsers}
            options={users.map((u) => ({
              label: `${u.firstName} ${u.lastName}`,
              value: u.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Lloji i Komunikimit"
          name="comunicationTypeID"
          rules={[
            {
              required: true,
              message: "Zgjidh një lloj komunikimi!",
            },
          ]}
        >
          <Select
            placeholder="Zgjidh llojin"
            loading={loadingTypes}
            options={commTypes.map((t) => ({
              label: t.type,
              value: t.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Vlera"
          name="value"
          rules={[{ required: true, message: "Vendos një vlerë!" }]}
        >
          <Input placeholder="Vendos vlerën" />
        </Form.Item>

        {selectedTypeID !== 1 && (
          <Form.Item label="Përdoruesi (kredencialet)" name="username">
            <Input placeholder="Username" />
          </Form.Item>
        )}

        {![1, 3, 5].includes(selectedTypeID) && (
          <Form.Item
            label="Fjalëkalimi"
            name="password"
            rules={[
              {
                required: true,
                message: "Vendos fjalëkalimin!",
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Shto Komunikim
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddCommunication;
