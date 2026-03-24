import { defineType, defineField } from "sanity";

export default defineType({
  name: "project",
  title: "프로젝트",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "프로젝트 제목",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL 슬러그",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "프로젝트 미디어 (이미지/동영상)",
      type: "array",
      description:
        "이미지와 동영상을 자유롭게 업로드하고, 대표 이미지 4개와 커버 이미지 1개를 선택하세요",
      of: [
        {
          type: "image",
          title: "이미지",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              title: "Alt 텍스트",
              type: "string",
            },
            {
              name: "isFeatured",
              title: "대표 미디어로 사용",
              type: "boolean",
              description: "홈페이지 그리드에 표시됩니다 (정확히 4개 선택)",
              initialValue: false,
            },
            {
              name: "isCover",
              title: "커버 미디어로 사용",
              type: "boolean",
              description: "프로젝트 대표 커버 (1개만 선택)",
              initialValue: false,
            },
          ],
          preview: {
            select: {
              media: "asset",
              alt: "alt",
              isFeatured: "isFeatured",
              isCover: "isCover",
            },
            prepare({ media, alt, isFeatured, isCover }: any) {
              const badges = [];
              if (isFeatured) badges.push("대표");
              if (isCover) badges.push("커버");
              const badgeText =
                badges.length > 0 ? ` [${badges.join(", ")}]` : "";

              return {
                title: (alt || "이미지") + badgeText,
                subtitle: "IMAGE",
                media: media,
              };
            },
          },
        },
        {
          type: "object",
          title: "동영상",
          name: "video",
          fields: [
            {
              name: "videoType",
              title: "동영상 타입",
              type: "string",
              options: {
                list: [
                  { title: "파일 업로드", value: "file" },
                  { title: "YouTube", value: "youtube" },
                ],
                layout: "radio",
              },
              initialValue: "youtube",
            },
            {
              name: "videoFile",
              title: "동영상 파일",
              type: "file",
              options: {
                accept: "video/*",
              },
              hidden: ({ parent }: any) => parent?.videoType !== "file",
            },
            {
              name: "url",
              title: "동영상 URL",
              type: "url",
              description: "YouTube URL을 입력하세요",
              hidden: ({ parent }: any) => parent?.videoType === "file",
              validation: (Rule) =>
                Rule.custom((url: string, context: any) => {
                  const parent = context.parent as any;
                  if (parent?.videoType === "file") return true;
                  if (!url) return "URL을 입력해주세요";
                  return true;
                }),
            },
            {
              name: "thumbnail",
              title: "썸네일 이미지 (필수)",
              type: "image",
              description:
                "홈페이지 그리드와 커버에 표시될 썸네일 (대표로 선택 시 필수)",
              validation: (Rule) =>
                Rule.custom((thumbnail: any, context: any) => {
                  const parent = context.parent as any;
                  if ((parent?.isFeatured || parent?.isCover) && !thumbnail) {
                    return "대표 또는 커버로 선택된 동영상은 썸네일이 필수입니다";
                  }
                  return true;
                }),
            },
            {
              name: "isFeatured",
              title: "대표 미디어로 사용",
              type: "boolean",
              description:
                "홈페이지 그리드에 썸네일이 표시됩니다 (정확히 4개 선택)",
              initialValue: false,
            },
            {
              name: "isCover",
              title: "커버 미디어로 사용",
              type: "boolean",
              description: "프로젝트 대표 커버 (1개만 선택)",
              initialValue: false,
            },
            {
              name: "caption",
              title: "캡션",
              type: "string",
            },
          ],
          preview: {
            select: {
              videoType: "videoType",
              url: "url",
              thumbnail: "thumbnail",
              isFeatured: "isFeatured",
              isCover: "isCover",
            },
            prepare({ videoType, url, thumbnail, isFeatured, isCover }: any) {
              const badges = [];
              if (isFeatured) badges.push("대표");
              if (isCover) badges.push("커버");
              const badgeText =
                badges.length > 0 ? ` [${badges.join(", ")}]` : "";

              return {
                title:
                  (videoType === "file" ? "업로드된 동영상" : url || "동영상") +
                  badgeText,
                subtitle: videoType?.toUpperCase() || "VIDEO",
                media: thumbnail,
              };
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .custom((items: any) => {
            if (!items) return true;

            // 이미지와 동영상 모두에서 대표/커버 선택 가능
            const featuredCount = items.filter(
              (item: any) => item.isFeatured
            ).length;
            const coverCount = items.filter((item: any) => item.isCover).length;

            if (featuredCount !== 4) {
              return "대표 미디어를 정확히 4개 선택해주세요 (이미지 또는 동영상)";
            }
            if (coverCount !== 1) {
              return "커버 미디어를 정확히 1개 선택해주세요 (이미지 또는 동영상)";
            }
            return true;
          }),
    }),
    defineField({
      name: "description",
      title: "프로젝트 설명",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "date",
      title: "프로젝트 날짜",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "orderRank",
      title: "순서",
      type: "string",
      hidden: true,
    }),
  ],
  orderings: [
    {
      title: "수동 정렬",
      name: "manualOrder",
      by: [{ field: "orderRank", direction: "asc" }],
    },
    {
      title: "날짜순",
      name: "dateOrder",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "images.0",
      date: "date",
    },
    prepare(selection) {
      const { title, media, date } = selection;
      return {
        title: title,
        subtitle: date,
        media: media,
      };
    },
  },
});
