import React, { useState } from "react";
import {
  Drawer,
  Input,
  Button,
  Form,
  Space,
  Divider,
  Card,
  TimePicker,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const AddTransport = ({ visible, onClose, refreshTransport }) => {
  const url = process.env.REACT_APP_API_URL;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const postData = {
      id: 0,
      relation: values.relation,
      transportRelationDetails:
        values.transportRelationDetails?.map((detail) => ({
          time: `${detail.startTime?.format(
            "HH:mm"
          )} - ${detail.endTime?.format("HH:mm")}`,
          company: detail.company,
        })) || [],
    };

    try {
      const response = await fetch(`${url}/TransportRelation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      toast.success("Marrëdhënia e transportit u shtua me sukses!");
      form.resetFields();
      onClose();
      if (refreshTransport) refreshTransport();
    } catch (error) {
      toast.error("Shtimi i lidhjes së transportit dështoi.");
      console.error("Error adding transport relation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title="Shto Linjë Transporti"
      placement="right"
      onClose={onClose}
      open={visible}
      width={600}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Lidhja"
          name="relation"
          rules={[{ required: true, message: "Vendos një lidhje!" }]}
        >
          <Input placeholder="Shëno lidhjen e linjës" />
        </Form.Item>

        <Divider orientation="left">Detajet e Transportit</Divider>

        <Form.List name="transportRelationDetails">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  style={{ marginBottom: 16 }}
                  extra={
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{ color: "red" }}
                    />
                  }
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div className="flex items-center justify-between gap-4">
                      <Form.Item
                        {...restField}
                        label="Koha e Nisjes"
                        name={[name, "startTime"]}
                        rules={[
                          { required: true, message: "Vendos kohën e nisjes!" },
                        ]}
                        className="flex-1"
                      >
                        <TimePicker
                          format="HH:mm"
                          style={{ width: "100%" }}
                          placeholder="Zgjidh kohën e nisjes"
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label="Koha e Mbarimit"
                        name={[name, "endTime"]}
                        rules={[
                          {
                            required: true,
                            message: "Vendos kohën e mbarimit!",
                          },
                        ]}
                        className="flex-1"
                      >
                        <TimePicker
                          format="HH:mm"
                          style={{ width: "100%" }}
                          placeholder="Zgjidh kohën e mbarimit"
                        />
                      </Form.Item>
                    </div>
                    <Form.Item
                      {...restField}
                      label="Kompania"
                      name={[name, "company"]}
                      rules={[{ required: true, message: "Vendos kompaninë!" }]}
                    >
                      <Input placeholder="Shëno emrin e kompanisë" />
                    </Form.Item>
                  </Space>
                </Card>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Shto Detaj Transporti
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Shto Linjë
            </Button>
            <Button onClick={onClose}>Anulo</Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddTransport;
