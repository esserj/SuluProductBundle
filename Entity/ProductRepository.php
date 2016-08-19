<?php

namespace Sulu\Bundle\ProductBundle\Entity;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\NoResultException;
use Sulu\Bundle\ProductBundle\Product\ProductRepositoryInterface;
use Sulu\Bundle\ProductBundle\Entity\Product;

/**
 * ProductRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class ProductRepository extends EntityRepository implements ProductRepositoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function findById($id)
    {
        try {
            $qb = $this->createQueryBuilder('product')
                ->andWhere('product.id = :productId')
                ->setParameter('productId', $id);

            return $qb->getQuery()->getSingleResult();
        } catch (NoResultException $exc) {
            return null;
        }
    }

    /**
     * {@inheritDoc}
     */
    public function findByIdAndLocale($id, $locale)
    {
        try {
            $qb = $this->getProductQuery($locale);
            $qb->andWhere('product.id = :productId');
            $qb->setParameter('productId', $id);

            return $qb->getQuery()->getSingleResult();
        } catch (NoResultException $exc) {
            return null;
        }
    }

    /**
     * Returns all products in the given locale
     * @param string $locale The locale of the product to load
     * @return ProductInterface[]
     */
    public function findAllByLocale($locale)
    {
        try {
            return $this->getProductQuery($locale)->getQuery()->getResult();
        } catch (NoResultException $exc) {
            return null;
        }
    }

    /**
     * {@inheritdoc}
     */
    public function findByLocaleAndInternalItemNumber($locale, $internalItemNumber)
    {
        try {
            $qb = $this->getProductQuery($locale);
            $qb->andWhere('product.internalItemNumber = :internalItemNumber');
            $qb->andWhere('type.id = :id');
            $qb->setParameter('internalItemNumber', $internalItemNumber);
            $qb->setParameter('id', Product::SIMPLE_PRODUCT);
            $query = $qb->getQuery();
            return $query->getResult();
        } catch (NoResultException $exc) {
            return null;
        }
    }

    /**
     * {@inheritdoc}
     */
    public function findByInternalItemNumber($internalItemNumber)
    {
        try {
            $qb = $this->createQueryBuilder('product')
                ->where('product.internalItemNumber = :internalItemNumber')
                ->setParameter('internalItemNumber', $internalItemNumber);
            $query = $qb->getQuery();

            return $query->getResult();
        } catch (NoResultException $exc) {
            return null;
        }
    }

    /**
     * {@inheritdoc}
     */
    public function findByGlobalTradeItemNumber($globalTradeItemNumber)
    {
        try {
            $qb = $this->createQueryBuilder('product')
                ->where('product.globalTradeItemNumber = :globalTradeItemNumber')
                ->setParameter('globalTradeItemNumber', $globalTradeItemNumber);
            $query = $qb->getQuery();

            return $query->getResult();
        } catch (NoResultException $exc) {
            return null;
        }
    }

    /**
     * {@inheritDoc}
     */
    public function findByLocaleAndFilter($locale, array $filter)
    {
        try {
            $qb = $this->getProductQuery($locale);

            foreach ($filter as $key => $value) {
                switch ($key) {
                    case 'parent':
                        $qb->andWhere('parent.id = :' . $key);
                        $qb->setParameter($key, $value);
                        break;

                    case 'status':
                        $qb->andWhere('status.id = :' . $key);
                        $qb->setParameter($key, $value);
                        break;

                    case 'type_id':
                        $qb->andWhere('type.id = :' . $key);
                        $qb->setParameter($key, $value);
                        break;
                }
            }

            $query = $qb->getQuery();
            return $query->getResult();
        } catch (NoResultException $ex) {
            return null;
        }
    }

    /**
     * Returns the query for products
     * @param string $locale The locale to load
     * @return \Doctrine\ORM\QueryBuilder
     */
    private function getProductQuery($locale)
    {
        $qb = $this->createQueryBuilder('product')
            ->addSelect('prices')
            ->addSelect('parent')
            ->addSelect('translations')
            ->addSelect('status')
            ->addSelect('type')
            ->addSelect('currency')
            ->addSelect('media')
            ->leftJoin('product.parent', 'parent')
            ->leftJoin('product.translations', 'translations', 'WITH', 'translations.locale = :locale')
            ->leftJoin('product.status', 'status')
            ->leftJoin('status.translations', 'statusTranslations', 'WITH', 'statusTranslations.locale = :locale')
            ->leftJoin('product.type', 'type')
            ->leftJoin('type.translations', 'typeTranslations', 'WITH', 'typeTranslations.locale = :locale')
            ->leftJoin('product.prices', 'prices')
            ->leftJoin('prices.currency', 'currency')
            ->leftJoin('product.media', 'media')
            ->setParameter('locale', $locale);

        return $qb;
    }

    /**
     * Returns all products with the given locale and ids
     *
     * @param string $locale The locale to load
     * @param array $ids
     * @return ProductInterface[]
     */
    public function findByLocaleAndIds($locale, array $ids = array())
    {
        try {
            $qb = $this->getProductQuery($locale);
            $qb->where('product.id IN (:ids)');
            $qb->setParameter('ids', $ids);
            $query = $qb->getQuery();

            return $query->getResult();
        } catch (NoResultException $ex) {
            return null;
        }
    }

    /**
     * {@inheritdoc}
     */
    public function findByCategoryId($categoryId, $locale)
    {
        return $this->findByCategoryIdsAndTags([$categoryId], null, $locale);
    }

    /**
     * {@inheritdoc}
     */
    public function findByTags(array $tags, $locale)
    {
        return $this->findByCategoryIdsAndTags(null, $tags, $locale);
    }

    /**
     * {@inheritdoc}
     */
    public function findByCategoryIdsAndTags(array $categoryIds = null, array $tags = null, $locale)
    {
        $qb = $this->getProductQuery($locale);

        foreach ($categoryIds as $categoryId) {
            $qb->join('product.categories', 'categories' . $categoryId)
                ->andWhere('categories' . $categoryId . '.id IN (:categoryId' . $categoryId . ')')
                ->setParameter('categoryId' . $categoryId, [$categoryId]);
        }

        foreach($tags as $tag) {
            $qb->join('product.tags', 'tag' . $tag)
                ->andWhere('tag' . $tag . '.name IN (:tagName' . $tag . ')')
                ->setParameter('tagName' . $tag, [$tag]);
        }

        return $qb->getQuery()->getResult();
    }
}
