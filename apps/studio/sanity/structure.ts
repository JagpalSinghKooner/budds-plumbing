import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';
import type { StructureBuilder, StructureContext } from 'sanity/structure';
import {
  Files,
  BookA,
  User,
  ListCollapse,
  Quote,
  Menu,
  Settings,
  Wrench,
  MapPin,
  MapPinned,
} from 'lucide-react';

export const structure = (S: StructureBuilder, context: StructureContext) =>
  S.list()
    .title('Content')
    .items([
      orderableDocumentListDeskItem({
        type: 'page',
        title: 'Pages',
        icon: Files,
        S,
        context,
      }),
      S.listItem()
        .title('Posts')
        .schemaType('post')
        .child(
          S.documentTypeList('post')
            .title('Post')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }]) // Default ordering
        ),
      S.divider({ title: 'Business' }),
      orderableDocumentListDeskItem({
        type: 'serviceCategory',
        title: 'Service Categories',
        S,
        context,
      }),
      S.listItem()
        .title('Services')
        .icon(Wrench)
        .child(
          S.documentTypeList('service')
            .title('Services')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
        ),
      S.listItem()
        .title('Locations')
        .icon(MapPin)
        .child(
          S.documentTypeList('location')
            .title('Locations')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
        ),
      S.listItem()
        .title('Service Locations')
        .icon(MapPinned)
        .child(
          S.documentTypeList('service-location').title('Service Locations')
        ),
      S.divider({ title: 'Content' }),
      orderableDocumentListDeskItem({
        type: 'category',
        title: 'Categories',
        icon: BookA,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'author',
        title: 'Authors',
        icon: User,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'faq',
        title: 'FAQs',
        icon: ListCollapse,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'testimonial',
        title: 'Testimonials',
        icon: Quote,
        S,
        context,
      }),
      S.divider({ title: 'Global' }),
      S.listItem()
        .title('Navigation')
        .icon(Menu)
        .child(
          S.editor()
            .id('navigation')
            .schemaType('navigation')
            .documentId('navigation')
        ),
      S.listItem()
        .title('Settings')
        .icon(Settings)
        .child(
          S.editor()
            .id('settings')
            .schemaType('settings')
            .documentId('settings')
        ),
      S.listItem()
        .title('Clients')
        .child(
          S.documentTypeList('client')
            .title('Clients')
            .defaultOrdering([{ field: 'businessName', direction: 'asc' }])
        ),
    ]);
