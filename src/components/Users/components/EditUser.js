import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  Switch,
  Row,
  Col,
  Typography,
  Spin,
  Card,
  Breadcrumb,
  Tabs,
} from "antd";
import toast from "react-hot-toast";
import Navbar from "../../Navbar/Navbar";
import Communication from "../../Communication/Communication";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState(null);
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${url}/LocalUserRole`);
        setRoles(await res.json());
      } catch {
        toast.error("Failed to load roles");
      }
    };
    const fetchData = async () => {
      try {
        const res = await fetch(`${url}/User/id?id=${id}`);
        const data = await res.json();
        setUser(data.user);
        setSubject(data.subject);
        form.setFieldsValue({
          key: data.user.key,
          roleID: data.user.role.id,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          username: data.user.username,
          password: data.user.password,
          note: data.user.note,
          active: data.user.active,
        });
      } catch {
        toast.error("Failed to load user");
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
    fetchData();
  }, [id, url, form]);

  const onFinish = async (vals) => {
    setSaving(true);
    const payload = {
      id: parseInt(id, 10),
      key: vals.key,
      roleID: vals.roleID,
      firstName: vals.firstName,
      lastName: vals.lastName,
      username: vals.username,
      password: vals.password?.trim() ? vals.password : undefined,
      note: vals.note,
      active: vals.active,
    };
    try {
      const res = await fetch(`${url}/User?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Përdoruesi u përditësua me sukses!");
      navigate(-1);
    } catch {
      toast.error("Dështoi përditësimin e përdoruesit");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <Spin className="d-flex justify-center items-center m-auto" />;

  const breadcrumbItems = [
    { title: <Link to="/">Faqja Kryesore</Link> },
    { title: <Link to="/users">Subjektet dhe Përdoruesit</Link> },
    { title: "Edito Subjektet dhe Përdoruesit" },
  ];

  return (
    <div>
      <Navbar />
      <div className="p-8 bg-gray-50 min-h-screen">
        <header className="mb-6 border-b pb-3 flex justify-between items-center pt-20">
          <div>
            <Breadcrumb
              className="text-sm text-gray-600 mb-2"
              items={breadcrumbItems}
            />
            <h1 className="font-bold text-2xl">
              Edito Subjektet dhe Përdoruesit
            </h1>
            <span className="font-normal">Edito Subjektet dhe Përdoruesit</span>
          </div>
        </header>

        <Tabs defaultActiveKey="1">
          <TabPane tab="Detajet e Përdoruesit" key="1">
            <Card title="Informacioni i Subjektit" className="mb-8">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Text strong>Emertimi:</Text>
                  <div>{subject?.Emertimi || "-"}</div>
                </Col>
                <Col span={8}>
                  <Text strong>Shifra:</Text>
                  <div>{subject?.Shifra || "-"}</div>
                </Col>
                <Col span={8}>
                  <Text strong>Emri Tregtar:</Text>
                  <div>{subject?.["Emri Tregtar"] || "-"}</div>
                </Col>
                <Col span={8}>
                  <Text strong>NUI:</Text>
                  <div>{subject?.NUI || "-"}</div>
                </Col>
                <Col span={8}>
                  <Text strong>Nr. Fiskal:</Text>
                  <div>{subject?.["Nr. Fiskal"] || "-"}</div>
                </Col>
                <Col span={8}>
                  <Text strong>Nr. i Biznesit:</Text>
                  <div>{subject?.["Nr. i Biznesit"] || "-"}</div>
                </Col>
                <Col span={8}>
                  <Text strong>Nr. i Tvsh:</Text>
                  <div>{subject?.["Nr. i Tvsh"] || "-"}</div>
                </Col>
                <Col span={8}>
                  <Text strong>Adresa:</Text>
                  <div>{subject?.Adresa || "-"}</div>
                </Col>
                <Col span={8}>
                  <Text strong>Telefoni:</Text>
                  <div>{subject?.Telefoni || "-"}</div>
                </Col>
                <Col span={8}>
                  <Text strong>Celulari:</Text>
                  <div>{subject?.Celulari || "-"}</div>
                </Col>
              </Row>
            </Card>

            <Card title="Detajet e Përdoruesit">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ active: true }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Çelësi"
                      name="key"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Roli"
                      name="roleID"
                      rules={[{ required: true }]}
                    >
                      <Select
                        options={roles.map((r) => ({
                          label: r.role,
                          value: r.id,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Emri"
                      name="firstName"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Mbiemri"
                      name="lastName"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Përdoruesi"
                      name="username"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Fjalëkalimi" name="password">
                      <Input.Password placeholder="Lëre bosh për të ruajtur të vjetrën" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Shënim" name="note">
                      <Input.TextArea rows={3} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Aktiv"
                      name="active"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={saving}>
                    Ruaj
                  </Button>
                  <Button
                    style={{ marginLeft: 8 }}
                    onClick={() => navigate(-1)}
                  >
                    Anulo
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>

          <TabPane tab="Komunikimi" key="2">
            <Communication />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default EditUser;
