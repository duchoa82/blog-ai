import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Page,
  Button,
  Tabs,
  Text,
  Badge,
  Card,
  DataTable,
  Icon,
  InlineStack,
  BlockStack,
  Thumbnail,
  ButtonGroup,
  Popover,
  ActionList,
  TextField
} from "@shopify/polaris";
import {
  PlusIcon,
  SearchIcon,
  EditIcon
} from "@shopify/polaris-icons";

const Blogs = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddBlogWithAI = () => {
    navigate('/generate', { state: { from: 'blogs' } });
  };

  const articles = [
    {
      id: 1,
      title: 'This is the blog post title.',
      keyword: '',
      author: 'Tapita',
      blog: '',
      lastModified: '8/9/2025, 5:05:34 PM',
      seoScore: 80,
      seoColor: 'warning',
      status: 'Draft',
      statusColor: 'info'
    },
    {
      id: 2,
      title: 'test.',
      keyword: 't-shirt',
      author: 'Tapita',
      blog: 'test1',
      lastModified: '8/9/2025, 1:46:23 PM',
      seoScore: 96,
      seoColor: 'success',
      status: 'Draft',
      statusColor: 'info'
    },
    {
      id: 3,
      title: 'This is the blog post title.',
      keyword: '',
      author: 'Tapita',
      blog: '',
      lastModified: '8/8/2025, 4:50:09 PM',
      seoScore: 80,
      seoColor: 'warning',
      status: 'Draft',
      statusColor: 'info'
    },
    {
      id: 4,
      title: 'Stay Cool in Style: Must-Have T-Shirt Trends for Summer 2025.',
      titleIcon: EditIcon,
      keyword: 't-shirt,summer',
      author: 'Tapita',
      blog: 'news',
      lastModified: '8/8/2025, 4:32:12 PM',
      seoScore: 96,
      seoColor: 'success',
      status: 'Draft',
      statusColor: 'info'
    },
    {
      id: 5,
      title: 'The Definitive Guide to Luxury Automatic Watches for Men: Movements, Materials, and Masterpieces.',
      titleIcon: EditIcon,
      keyword: '',
      author: 'hoa truong',
      blog: 'news',
      lastModified: '4/1/2025, 10:54:26 AM',
      seoScore: null,
      seoColor: 'base',
      status: 'Published',
      statusColor: 'success'
    }
  ];

  // Filter articles based on selected tab
  const getFilteredArticles = () => {
    switch (selectedTab) {
      case 0: // All
        return articles;
      case 1: // Published
        return articles.filter(article => article.status === 'Published');
      case 2: // Drafts
        return articles.filter(article => article.status === 'Draft');
      case 3: // Scheduled
        return articles.filter(article => article.status === 'Scheduled');
      default:
        return articles;
    }
  };

  const filteredArticles = getFilteredArticles();

  const tabs = [
    {
      id: 'all',
      content: 'All',
      badge: articles.length.toString(),
      accessibilityLabel: 'All articles',
      panelID: 'all-articles',
    },
    {
      id: 'published',
      content: 'Published',
      badge: articles.filter(article => article.status === 'Published').length.toString(),
      accessibilityLabel: 'Published articles',
      panelID: 'published-articles',
    },
    {
      id: 'drafts',
      content: 'Drafts',
      badge: articles.filter(article => article.status === 'Draft').length.toString(),
      accessibilityLabel: 'Draft articles',
      panelID: 'draft-articles',
    },
    {
      id: 'scheduled',
      content: 'Scheduled',
      badge: articles.filter(article => article.status === 'Scheduled').length.toString(),
      accessibilityLabel: 'Scheduled articles',
      panelID: 'scheduled-articles',
    },
  ];

  const getSeoIcon = (score: number | null) => {
    return null;
  };

  const getSeoColor = (score: number | null) => {
    if (score === null) return 'base';
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'base';
  };

  const rows = filteredArticles.map((article) => [
    <Text variant="bodyMd" as="span" fontWeight="medium">
      {article.title}
    </Text>,
    article.keyword ? (
      <Badge tone="base" size="small">
        {article.keyword}
      </Badge>
    ) : '-',
    <Text variant="bodyMd" as="span">
      {article.author}
    </Text>,
    article.blog ? (
      <Badge tone="base" size="small">
        {article.blog}
      </Badge>
    ) : '-',
    <Text variant="bodyMd" as="span">
      {article.lastModified}
    </Text>,
    <Badge 
      tone={getSeoColor(article.seoScore) as any} 
      size="small"
    >
      {article.seoScore || '-'}
    </Badge>,
    <Badge 
      tone={article.statusColor as any} 
      size="small"
    >
      {article.status}
    </Badge>,
    <ButtonGroup>
      <Popover
        active={false}
        activator={
                  <Button
          variant="tertiary"
          accessibilityLabel="More actions"
        >
          ⋯
        </Button>
        }
        onClose={() => {}}
      >
        <ActionList
          actionRole="menuitem"
          items={[
            { content: 'Edit' },
            { content: 'Duplicate' },
            { content: 'Delete', destructive: true },
          ]}
        />
      </Popover>
    </ButtonGroup>
  ]);

  return (
    <Page
      title="Articles"
      primaryAction={
        <InlineStack gap="200">
          <Button
            icon={PlusIcon}
            variant="secondary"
            size="large"
          >
            Add blog post from scratch
          </Button>
          <Button
            variant="primary"
            size="large"
            onClick={handleAddBlogWithAI}
          >
            Add blogpost using AI
          </Button>
        </InlineStack>
      }
    >
      <BlockStack gap="500">
        {/* Tabs and Search */}
        <Card>
          <InlineStack align="space-between">
            <Tabs
              tabs={tabs}
              selected={selectedTab}
              onSelect={setSelectedTab}
              variant="segmented"
            />
            <Button
              icon={SearchIcon}
              variant="tertiary"
              accessibilityLabel="Search articles"
            />
          </InlineStack>
        </Card>

        {/* Articles Table */}
        <Card>
          <DataTable
            columnContentTypes={[
              'text',
              'text',
              'text',
              'text',
              'text',
              'text',
              'text',
              'text',
            ]}
            headings={[
              'Title',
              'Keyword',
              'Author',
              'Blog',
              'Last modified',
              'SEO',
              'Status',
              'Action',
            ]}
            rows={rows}
            hoverable
          />
        </Card>
      </BlockStack>
    </Page>
  );
};

export default Blogs;
