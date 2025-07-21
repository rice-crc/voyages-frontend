import { useEffect, useRef, useState } from 'react';

import { BookOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  List,
  Pagination,
  Typography,
  Image,
  Row,
  Col,
} from 'antd';
import DOMPurify from 'dompurify';

import { useDimensions } from '@/hooks/useDimensions';
import { DocumentItemInfo } from '@/utils/functions/documentWorkspace';
import '@/style/document.scss';

const { Title, Text } = Typography;

interface DocumentPaginationSource {
  count: number;
  currentPage?: number;
  getPage: (pageNum: number, pageSize: number) => Promise<DocumentItemInfo[]>;
}

type DocumentGalleryViewMode = 'grid' | 'list';

interface DocumentGalleryProps {
  title: string;
  pageSize: number;
  source: DocumentPaginationSource;
  thumbSize: number;
  viewMode?: DocumentGalleryViewMode;
  onDocumentOpen: (doc: DocumentItemInfo) => void;
  onPageChange: (page: number) => void;
}

const DocumentGallery = ({
  title,
  pageSize,
  source,
  thumbSize,
  viewMode,
  onDocumentOpen,
  onPageChange,
}: DocumentGalleryProps) => {
  const [contents, setContents] = useState<DocumentItemInfo[]>([]);

  const numPages = Math.ceil(source.count / pageSize);

  useEffect(() => {
    const refresh = async () => {
      setContents(
        await source.getPage(
          Math.min(numPages, source.currentPage ?? 1),
          pageSize,
        ),
      );
    };
    refresh();
  }, [source, numPages, pageSize]);

  const galleryDivRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(galleryDivRef);

  // Calculate responsive grid columns
  const getGridCols = () => {
    if (width < 576) return 1; // xs
    if (width < 768) return 2; // sm
    return Math.max(1, Math.floor((0.9 * width) / thumbSize));
  };

  // Calculate responsive thumb size
  const getResponsiveThumbSize = () => {
    if (width < 576) return Math.min(thumbSize, width * 0.8); // xs
    if (width < 768) return Math.min(thumbSize, width * 0.4); // sm
    return thumbSize;
  };

  const responsiveThumbSize = getResponsiveThumbSize();
  const gridCols = getGridCols();
  const isMobile = width < 576;
  const isTablet = width < 768;

  const paginationStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    padding: isMobile ? '16px' : '24px',
  };

  const paginator = (
    <div style={paginationStyle}>
      <Pagination
        total={source.count}
        current={source.currentPage ?? 1}
        pageSize={pageSize}
        onChange={onPageChange}
        size={isMobile ? 'small' : 'default'}
        showSizeChanger={false}
        showQuickJumper={!isMobile}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
      />
    </div>
  );

  const containerStyle: React.CSSProperties = {
    width: '100%',
    padding: isMobile ? '16px' : '24px',
  };

  const titleStyle: React.CSSProperties = {
    marginBottom: '16px',
    fontSize: isMobile ? '1.1rem' : isTablet ? '1.5rem' : '2rem',
    fontWeight: 'bold',
  };

  const countStyle: React.CSSProperties = {
    marginLeft: '8px',
    fontSize: isMobile ? '0.8rem' : '0.9rem',
    color: '#666',
    fontWeight: 'normal',
  };

  return (
    <div ref={galleryDivRef} style={containerStyle}>
      <Title level={isMobile ? 4 : 2} style={titleStyle}>
        {title}
        <Text style={countStyle}>(Item count: {source.count})</Text>
      </Title>

      {viewMode === 'list' && (
        <div
          style={{
            maxHeight: isMobile ? 'calc(100vh - 180px)' : 'calc(100vh - 220px)',
            overflowY: 'auto',
          }}
        >
          <List
            dataSource={contents}
            renderItem={(item) => (
              <List.Item style={{ padding: isMobile ? '16px 0' : '16px' }}>
                <Card
                  hoverable
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                  }}
                  styles={{
                    body: {
                      padding: isMobile ? '16px' : '24px',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    },
                  }}
                  cover={
                    item.thumb && !isMobile ? undefined : item.thumb ? (
                      <Image
                        src={item.thumb}
                        alt={item.label}
                        style={{
                          height: isMobile
                            ? '200px'
                            : `${responsiveThumbSize}px`,
                          objectFit: 'cover',
                        }}
                        preview={false}
                      />
                    ) : undefined
                  }
                >
                  <div style={{ display: 'flex', width: '100%' }}>
                    {item.thumb && !isMobile && (
                      <Image
                        src={item.thumb}
                        alt={item.label}
                        style={{
                          width: `${responsiveThumbSize}px`,
                          height: `${responsiveThumbSize}px`,
                          objectFit: 'cover',
                          marginRight: '16px',
                        }}
                        preview={false}
                      />
                    )}
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                      }}
                    >
                      <div>
                        {item.bib ? (
                          <div
                            style={{
                              fontSize: isMobile ? '0.9rem' : '1rem',
                              lineHeight: 1.4,
                              marginBottom: '12px',
                            }}
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(item.bib),
                            }}
                          />
                        ) : (
                          <Title
                            level={isMobile ? 5 : 4}
                            style={{
                              fontSize: isMobile ? '1.1rem' : '1.25rem',
                              fontWeight: 500,
                              margin: 0,
                              marginBottom: '12px',
                            }}
                          >
                            {item.label}
                          </Title>
                        )}
                        {item.textSnippet && (
                          <div
                            style={{
                              padding: '16px',
                              fontSize: isMobile ? '0.8rem' : '0.9rem',
                              color: '#666',
                              lineHeight: 1.5,
                              whiteSpace: 'normal',
                              wordBreak: 'break-word',
                              backgroundColor: '#f5f5f5',
                              borderRadius: '4px',
                              marginTop: '8px',
                              marginBottom: '12px',
                            }}
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(item.textSnippet),
                            }}
                          />
                        )}
                      </div>
                      <div style={{ flex: 1 }} />
                      <div style={{ marginTop: 'auto', paddingTop: 12 }}>
                        <Button
                          type="primary"
                          icon={<BookOutlined />}
                          onClick={() => onDocumentOpen(item)}
                          size={isMobile ? 'small' : 'middle'}
                          className="view-document-btn"
                        >
                          View Document
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </div>
      )}

      {viewMode !== 'list' && (
        <div
          style={{
            maxHeight: isMobile ? 'calc(100vh - 180px)' : 'calc(100vh - 220px)',
            overflowY: 'auto',
          }}
        >
          <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
            {contents.map((item) => (
              <Col
                key={item.key}
                span={24 / gridCols}
                style={{
                  minWidth: `${responsiveThumbSize}px`,
                  maxWidth: `${responsiveThumbSize}px`,
                }}
              >
                <Card
                  hoverable
                  style={{
                    width: responsiveThumbSize,
                    height: responsiveThumbSize,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                  bodyStyle={{ padding: 0, height: '100%' }}
                  cover={
                    item.thumb ? (
                      <Image
                        src={item.thumb}
                        alt={item.label}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        preview={false}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <BookOutlined
                          style={{ fontSize: '48px', color: '#ccc' }}
                        />
                      </div>
                    )
                  }
                >
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                      padding: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: isMobile ? '0.8rem' : '0.9rem',
                        fontWeight: 500,
                        flex: 1,
                        marginRight: '8px',
                      }}
                      ellipsis
                    >
                      {item.label}
                    </Text>
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<BookOutlined />}
                      onClick={() => onDocumentOpen(item)}
                      size={isMobile ? 'small' : 'middle'}
                      style={{
                        backgroundColor: 'rgb(55, 148, 141)',
                        borderColor: 'rgb(55, 148, 141)',
                        minWidth: 'auto',
                      }}
                    />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
      {paginator}
    </div>
  );
};

export default DocumentGallery;
