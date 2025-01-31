import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { SettingContainer, SettingDivider, SettingGroup, SettingTitle } from '@renderer/pages/settings'
import { useMinapps } from '@renderer/hooks/useMinapps'
import { useTheme } from '@renderer/context/ThemeProvider'
import { IconSourceType, MinAppIcon, MinAppType } from '@renderer/types'
import { IconHelper } from '@renderer/utils/iconHelper'
import { Button, Form, Input, Radio, Space, Switch, Table, Upload, message } from 'antd'
import { FC, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

const CustomMinAppSettings: FC = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const location = useLocation()
  const { minapps, updateMinapps, pinned, updatePinnedMinapps } = useMinapps()
  const [form] = Form.useForm()
  const [isAdding, setIsAdding] = useState(false)
  const [editingApp, setEditingApp] = useState<MinAppType | null>(null)
  const [iconUrl, setIconUrl] = useState('')
  const [iconType, setIconType] = useState<IconSourceType>('url')
  const [iconPreview, setIconPreview] = useState<string>('')
  const [pinToSidebar, setPinToSidebar] = useState(false)

  useEffect(() => {
    const state = location.state as { editingApp?: MinAppType }
    if (state?.editingApp) {
      handleEdit(state.editingApp)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const getIconSrc = (logo: MinAppType['logo']): string => {
    console.log('Getting icon src for logo:', logo)
    if (!logo) {
      console.log('No logo, using default')
      return IconHelper.getDefaultIcon().value
    }
    if (typeof logo === 'string') {
      console.log('Logo is string')
      return logo
    }
    console.log('Using logo value:', logo.value)
    return logo.value
  }

  const handleIconTypeChange = (type: IconSourceType) => {
    setIconType(type)
    setIconUrl('')
    setIconPreview('')
    form.setFieldValue('iconUrl', '')
  }

  const handleIconDownload = async () => {
    try {
      const iconUrlValue = form.getFieldValue('iconUrl')
      if (!iconUrlValue) {
        message.error(t('settings.custom_minapp.icon_url_required'))
        return
      }

      const icon = await IconHelper.fetchIcon(iconUrlValue)
      if (!icon) {
        message.error(t('settings.custom_minapp.icon_download_failed'))
        return
      }

      setIconUrl(icon.value)
      setIconPreview(icon.value)
      message.success(t('settings.custom_minapp.icon_download_success'))
    } catch (error) {
      console.error('Failed to download icon:', error)
      message.error(t('settings.custom_minapp.icon_download_failed'))
    }
  }

  const handleLocalIconUpload = async (file: File) => {
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        setIconUrl(base64)
        setIconPreview(base64)
      }
      reader.readAsDataURL(file)
      return false
    } catch (error) {
      console.error('Failed to upload icon:', error)
      message.error(t('settings.custom_minapp.icon_upload_failed'))
      return false
    }
  }

  const handleAdd = async () => {
    try {
      const values = await form.validateFields()
      let icon: MinAppIcon | null = null

      if (iconUrl) {
        icon = {
          type: iconType,
          value: iconUrl,
          originalUrl: iconType === 'url' ? form.getFieldValue('iconUrl') : undefined
        }
        console.log('Saving icon:', icon)
      } else if (values.url && iconType === 'url') {
        icon = await IconHelper.fetchIcon(values.url)
        console.log('Fetched icon:', icon)
      }

      const newApp: MinAppType = {
        id: editingApp?.id || `custom_${uuidv4()}`,
        name: values.name,
        url: values.url,
        logo: icon || IconHelper.getDefaultIcon(),
        bodered: true
      }
      console.log('Saving app:', newApp)

      if (editingApp) {
        const updatedApps = minapps.map((app) => (app.id === editingApp.id ? newApp : app))
        updateMinapps(updatedApps)
        if (pinToSidebar) {
          if (!pinned.some((p) => p.id === editingApp.id)) {
            updatePinnedMinapps([...pinned, newApp])
          }
        } else {
          const updatedPinned = pinned.filter((p) => p.id !== editingApp.id)
          updatePinnedMinapps(updatedPinned)
        }
      } else {
        updateMinapps([...minapps, newApp])
        if (pinToSidebar) {
          updatePinnedMinapps([...pinned, newApp])
        }
      }

      form.resetFields()
      setIsAdding(false)
      setEditingApp(null)
      setIconUrl('')
      setIconPreview('')
      setIconType('url')
      setPinToSidebar(false)
    } catch (error) {
      console.error('Failed to add custom app:', error)
    }
  }

  const handleEdit = (app: MinAppType) => {
    setEditingApp(app)
    setIsAdding(true)
    const logo = app.logo
    if (logo) {
      if (typeof logo === 'string') {
        setIconType('url')
        setIconUrl(logo)
        setIconPreview(logo)
        form.setFieldValue('iconUrl', logo)
      } else {
        setIconType(logo.type)
        setIconUrl(logo.value)
        setIconPreview(logo.value)
        if (logo.type === 'url') {
          form.setFieldValue('iconUrl', logo.originalUrl)
        }
      }
    }
    setPinToSidebar(pinned.some((p) => p.id === app.id))
    form.setFieldsValue({
      name: app.name,
      url: app.url
    })
  }

  const handleDelete = (appId: string) => {
    const updatedApps = minapps.filter((app) => {
      if (!app.id) return false
      return !app.id.toString().startsWith('custom_') || app.id !== appId
    })
    updateMinapps(updatedApps)

    const updatedPinned = pinned.filter((app) => app.id !== appId)
    updatePinnedMinapps(updatedPinned)
  }

  const handleCancel = () => {
    form.resetFields()
    setIsAdding(false)
    setEditingApp(null)
    setIconUrl('')
    setIconPreview('')
    setIconType('url')
    setPinToSidebar(false)
  }

  const renderIconInput = () => {
    switch (iconType) {
      case 'url':
        return (
          <Input.Group compact>
            <Form.Item name="iconUrl" noStyle>
              <Input style={{ width: 'calc(100% - 100px)' }} placeholder={t('输入图标URL')} />
            </Form.Item>
            <Button onClick={handleIconDownload}>{t('下载')}</Button>
          </Input.Group>
        )
      case 'local':
        return (
          <Upload accept="image/*" showUploadList={false} beforeUpload={handleLocalIconUpload} maxCount={1}>
            <Button>{t('上传本地图片')}</Button>
          </Upload>
        )
      case 'base64':
        return (
          <Input.TextArea
            placeholder={t('输入Base64编码的图片数据')}
            onChange={(e) => {
              setIconUrl(e.target.value)
              setIconPreview(e.target.value)
            }}
            value={iconUrl}
            rows={4}
          />
        )
      default:
        return null
    }
  }

  const columns = [
    {
      title: t('settings.custom_minapp.name'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: t('图标'),
      key: 'logo',
      render: (_: any, record: MinAppType) => {
        console.log('Rendering icon for record:', record)
        return (
          <img
            src={getIconSrc(record.logo)}
            alt={record.name}
            style={{ width: 24, height: 24, objectFit: 'contain' }}
            onError={(e) => {
              console.log('Icon load error for:', record.id)
              e.currentTarget.src = IconHelper.getDefaultIcon().value
            }}
          />
        )
      }
    },
    {
      title: t('settings.custom_minapp.url'),
      dataIndex: 'url',
      key: 'url'
    },
    {
      title: t('settings.custom_minapp.actions'),
      key: 'actions',
      render: (_: any, record: MinAppType) =>
        record.id?.toString().startsWith('custom_') && (
          <Space>
            <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} title={t('common.edit')}>
              {t('common.edit')}
            </Button>
            <Button size="small" danger onClick={() => handleDelete(record.id?.toString() || '')}>
              {t('common.delete')}
            </Button>
          </Space>
        )
    }
  ]

  const customApps = minapps.filter((app) => app.id?.toString().startsWith('custom_'))

  return (
    <SettingContainer theme={theme}>
      <SettingGroup theme={theme}>
        <SettingTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {t('settings.custom_minapp.title')}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              handleCancel()
              setIsAdding(true)
            }}>
            {t('settings.custom_minapp.add')}
          </Button>
        </SettingTitle>
        <SettingDivider />

        {isAdding && (
          <Form form={form} layout="vertical" style={{ marginTop: 16, width: '100%' }}>
            <Form.Item
              name="name"
              label={t('settings.custom_minapp.name')}
              rules={[{ required: true, message: t('settings.custom_minapp.name_required') }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="url"
              label={t('settings.custom_minapp.url')}
              rules={[{ required: true, message: t('settings.custom_minapp.url_required') }]}>
              <Input />
            </Form.Item>
            <Form.Item label={t('图标类型')}>
              <Radio.Group value={iconType} onChange={(e) => handleIconTypeChange(e.target.value)}>
                <Radio.Button value="url">URL</Radio.Button>
                <Radio.Button value="local">本地图片</Radio.Button>
                <Radio.Button value="base64">Base64</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label={t('图标')}
              extra={
                iconPreview && (
                  <img
                    src={iconPreview}
                    alt="预览"
                    style={{ width: 48, height: 48, objectFit: 'contain', marginTop: 8 }}
                  />
                )
              }>
              {renderIconInput()}
            </Form.Item>
            <Form.Item label={t('固定到侧边栏')}>
              <Switch checked={pinToSidebar} onChange={(checked) => setPinToSidebar(checked)} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleAdd} style={{ marginRight: 8 }}>
                {editingApp ? t('common.save') : t('添加')}
              </Button>
              <Button onClick={handleCancel}>{t('common.cancel')}</Button>
            </Form.Item>
          </Form>
        )}

        <Table columns={columns} dataSource={customApps} pagination={false} rowKey="id" />
      </SettingGroup>
    </SettingContainer>
  )
}

export default CustomMinAppSettings
