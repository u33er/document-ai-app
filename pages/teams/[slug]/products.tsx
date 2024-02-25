import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPageWithLayout } from 'types';
import DropBox from '@/components/shared/DropBox';
import { useState, useCallback } from 'react';
import { Table } from '@/components/shared/ShowTable';

interface Image {
  id: number;
  src: string | ArrayBuffer | null;
}

const Products: NextPageWithLayout = () => {
  const [, setImages] = useState<Image[]>([]);
  const [data, setData] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
		acceptedFiles.map((file, index) => {
			const reader = new FileReader();

			reader.onload = function (e) {
        const result = e?.target?.result;
        if (result) {
				setImages((prevState) => [
					...prevState,
					{ id: index, src: result },
				]);
      }
			};

			reader.readAsDataURL(file);
			return file;
		});
	}, []);

  return (
    <div className="p-3">
      <DropBox onDrop={onDrop} />
    </div>
  );
};

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default Products;
