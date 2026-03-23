import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "default",
  title: "Portfolio",

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,

  plugins: [
    structureTool({
      structure: (S, context) => {
        return S.list()
          .id("root")
          .title("콘텐츠")
          .items([
            // 드래그로 순서 변경 가능한 프로젝트 목록
            orderableDocumentListDeskItem({
              type: "project",
              title: "프로젝트 (순서변경)",
              S,
              context,
            }),
            // 일반 리스트
            S.documentTypeListItem("project").title("프로젝트 (전체)"),
          ]);
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
